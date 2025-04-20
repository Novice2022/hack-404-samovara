using System.Security.Claims;
using Hakaton.DataAccess;
using Hakaton.DTO;
using Hakaton.GetParametrs;
using Hakaton.Models;
using Hakaton.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hakaton.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "VOLUNTEER")]
public class VolunteerPersonalAccountController : ControllerBase
{
    private readonly HakatonDbContext _dbContext;
    private readonly ILogger<VolunteerPersonalAccountController> _logger;
    private readonly IHostEnvironment _hostEnvironment; //for development status
    
    public VolunteerPersonalAccountController(IJwtService jwtService, HakatonDbContext dbContext, ILogger<VolunteerPersonalAccountController> logger, IHostEnvironment hostEnvironment)
    {
        _logger = logger;
        _dbContext = dbContext;
        _hostEnvironment = hostEnvironment;
    }
    
    [HttpGet("VolunteerPersonalAccount/requests/active")]
    public async Task<IActionResult> GetRequests([FromQuery] FilterRequestContracts_ForVolunteers? filterRequest)
    {
        try
        {
            var requests = _dbContext.Requests.Join(_dbContext.Users, 
                request => request.VeteranId, user => user.Id, (request, user) => new { request, user })
                .Where(request => request.request.Status == RequestStatus.New)
                .ToList();
            
            //Сортировка по типу
            if (filterRequest != null && filterRequest.Type.HasValue)
            {
                requests = requests
                    .Where(r => r.request.Type == filterRequest.Type)
                    .ToList();
            }
            
            //Сортировка по городу
            if (filterRequest != null && !string.IsNullOrEmpty(filterRequest.City))
            {
                requests = requests
                    .Where(r => r.request.City.ToLower() == filterRequest.City.ToLower())
                    .ToList();
            }
            
            if (filterRequest != null && filterRequest.createdAt.HasValue) //Боюсь пока добавлять сюда сортировку по дате
            {
                requests = requests
                    .Where(r => r.request.CreateAt == filterRequest.createdAt)
                    .ToList();
            }
            
            
            
            //Выбор по какому столбцу будем соритровать
            Func<RequestForVolunteersDtos, object> selectorKey = filterRequest?.ColumnOrder?.ToLower() switch
            {
                "type" => requests => requests.Type,
                "status" => requests => requests.Status,
                "createAt" => requests => requests.CreateAt,
                _ => requests => requests.Guid
            };

            var requestDtosList = requests.Select(request => new RequestForVolunteersDtos
            {
                Guid = request.request.Guid,
                Type = request.request.Type,
                Description = request.request.Description,
                City = request.request.City,
                LocationText = request.request.LocationText,
                Status = request.request.Status,
                CreateAt = request.request.CreateAt,
                Veteran = new VeteranForVolunteersDtos
                {
                    Id = request.user.Id,
                    FirstName = request.user.FirstName,
                    LastName = request.user.LastName,
                    PhoneNumber = request.user.PhoneNumber,
                }
            }).ToList();
            //Выбор типа сортировки
            requestDtosList = filterRequest?.OrderByType == "desc" ? requestDtosList.OrderByDescending(selectorKey).ToList() : requestDtosList.OrderBy(selectorKey).ToList();

            
            return Ok(requestDtosList);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while get active requests by the volunteer.");
            return BadRequest(500);
        }
    }
    
    [HttpPost("VolunteerPersonalAccount/requests/response/")]
    public async Task<IActionResult> CreateResponse(ResponseCreateDtos request_id)
    {
        try
        {
            // var request = await _dbContext.Requests.FindAsync(request_id.Guid);
            //
            // if (request == null)
            // {
            //     return NotFound($"Request with Guid {request_id.Guid} not found.");
            // }
            //
            // request.Status = RequestStatus.InProgress; 
            // request.SelectedExecutorId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            Guid currentIdUser = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var contactInfo = _dbContext.Users.Where(user => user.Id == currentIdUser).Select(user => user.PhoneNumber).First();
            Response response = new Response()
            {
                Id = Guid.NewGuid(),
                VolonteerId = currentIdUser,
                RequestId = request_id.Guid,
                ContactInfo = contactInfo,
                CreateAt = DateTime.UtcNow,
            };
            _dbContext.Responses.Add(response);
            await _dbContext.SaveChangesAsync();

            return Ok(new {Id = response.Id});
            
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while create response by the volunteer.");
            return BadRequest(500);
        }
    }
    
    [HttpGet("VolunteerPersonalAccount/responses")]
    public async Task<IActionResult> GetRequestByVolunteerId()
    {
        try
        {
            List<Guid> requestID = _dbContext.Responses
                .Where(response => response.VolonteerId == Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!))
                .Select(response => response.RequestId).ToList();
            var requests = _dbContext.Requests.Join(_dbContext.Users, 
                    request => request.VeteranId, user => user.Id, (request, user) => new { request, user })
                .Where(request => requestID.Contains(request.request.Guid) )
                .ToList();
        
            var requestDtosList = requests.Select(request => new RequestForVolunteersDtos
            {
                Guid = request.request.Guid,
                Type = request.request.Type,
                Description = request.request.Description,
                City = request.request.City,
                LocationText = request.request.LocationText,
                Status = request.request.Status,
                CreateAt = request.request.CreateAt,
                Veteran = new VeteranForVolunteersDtos
                {
                    Id = request.user.Id,
                    FirstName = request.user.FirstName,
                    LastName = request.user.LastName,
                    PhoneNumber = request.user.PhoneNumber,
                }
            }).ToList();
            
            return Ok(requestDtosList);

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while gel all response with id by the volunteer.");
            return BadRequest(500);
        }
        
    }
    
    
    
    
    
}