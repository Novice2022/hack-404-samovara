using System.Linq.Expressions;
using System.Security.Claims;
using Hakaton.DataAccess;
using Hakaton.DTO;
using Hakaton.GetParametrs;
using Hakaton.Models;
using Hakaton.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Extensions;

namespace Hakaton.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "VETERAN")]
public class VeteranPersonalAccountController: Controller
{
    private readonly HakatonDbContext _dbContext;
    private readonly ILogger<VeteranPersonalAccountController> _logger;
    private readonly IJwtService _jwtService;
    private readonly IHostEnvironment _hostEnvironment; //for development status

    public VeteranPersonalAccountController(IJwtService jwtService, HakatonDbContext dbContext, ILogger<VeteranPersonalAccountController> logger, IHostEnvironment hostEnvironment)
    {
        _logger = logger;
        _dbContext = dbContext;
        _jwtService = jwtService;
        _hostEnvironment = hostEnvironment;
    }
    
    //CREATE REQUEST
    [HttpPost("requests")]
    public async Task<IActionResult> CreateRequest([FromBody] RequestCreateDtos requestCreate)
    {
        try
        {
            Request newRequest = new Request()
            {
                Guid = Guid.NewGuid(),
                Type = requestCreate.Type,
                Description = requestCreate.Description,
                City = requestCreate.City,
                LocationText = requestCreate.LocationText,
                Status = RequestStatus.New,
                CreateAt = DateTime.UtcNow,
                SelectedExecutorId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value) //find current user from claims
            };
            _dbContext.Requests.Add(newRequest);
            await _dbContext.SaveChangesAsync();
            
            return Ok(new RequestCreateDtos{Type = newRequest.Type, Description = newRequest.Description, City = newRequest.City, LocationText = newRequest.LocationText});
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while create request by the veteran.");
            return BadRequest(500);
        }
    }

    //REFACTOR THIS LATER AFTER CREATE RESPONSE!!! if it needs
    [HttpGet("requests/")]
    public async Task<IActionResult> GetRequests([FromQuery] FilterRequestContracts? filterRequest)
    {
        try
        {
            // var requestQuery = _dbContext.Requests
            //     .Join(_dbContext.Responses,
            //         request => request.Guid,
            //         respons => respons.RequestId,
            //         (request, respons) => new
            //         {
            //             Request = request,
            //             Respons = respons
            //         }).AsQueryable();
            
            // var requestQuery = _dbContext.Requests
            //     .GroupJoin(_dbContext.Responses,
            //         request => request.Guid,
            //         response => response.RequestId,
            //         (request, responses) => new { request, responses })
            //     .SelectMany(
            //         r => r.responses.DefaultIfEmpty(),
            //         (r, response) => new
            //         {
            //             Request = r.request,
            //             Response = response 
            //         }
            //     )
            //     .ToList(); //Analog of left-join

            var requests = _dbContext.Requests.ToList();
            // var volunteers = _dbContext.Users
            //     .Where(user => user.Role == UserRole.VOLUNTEER)
            //     .Select(v => v.Id)
            //     .ToList();

            var responses = _dbContext.Responses.ToList();

            var requestDtosList = requests.Select(req => new RequestDtos
            {
                Guid = req.Guid,
                Type = req.Type,
                Description = req.Description,
                City = req.City,
                LocationText = req.LocationText,
                Status = req.Status,
                CreateAt = req.CreateAt,
                Responses = responses.Where(r => r.RequestId == req.Guid).ToList()
            }).ToList();
            
            //Сортировка по статусу
            if (filterRequest != null && filterRequest.Status.HasValue)
            {
                requestDtosList = requestDtosList
                    .Where(r => r.Status == filterRequest.Status)
                    .ToList();
            }
            
            //Сортировка по типу
            if (filterRequest != null && filterRequest.Type.HasValue)
            {
                requestDtosList = requestDtosList
                    .Where(r => r.Type == filterRequest.Type)
                    .ToList();
            }
            
            if (filterRequest != null && filterRequest.createdAt.HasValue) //Боюсь пока добавлять сюда сортировку по дате
            {
                requestDtosList = requestDtosList
                    .Where(r => r.CreateAt == filterRequest.createdAt)
                    .ToList();
            }

            //Выбор по какому столбцу будем соритровать
            Func<RequestDtos, object> selectorKey = filterRequest?.ColumnOrder?.ToLower() switch
            {
                "type" => requestDtosList => requestDtosList.Type,
                "experience" => requestDtosList => requestDtosList.Status,
                "income_date" => requestDtosList => requestDtosList.CreateAt,
                "responses" => requestDtosList => requestDtosList.Responses!.Count,
                _ => requestDtosList => requestDtosList.Guid
            };
            
            //Выбор типа сортировки
            requestDtosList = filterRequest?.OrderByType == "desc" ? requestDtosList.OrderByDescending(selectorKey).ToList() : requestDtosList.OrderBy(selectorKey).ToList();

            
            return Ok(requestDtosList);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while get requests by the veteran.");
            return BadRequest(500);
        }
    }
    
    [HttpDelete("requests/")]
    public async Task<IActionResult> DeleteRequest([FromQuery] Guid requestId)
    {
        try
        {
            var request = await _dbContext.Requests.FindAsync(requestId);

            if (request == null)
            {
                return NotFound(new { message = "Request not found" });
            }
            
            _dbContext.Requests.Remove(request);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Request successfully deleted" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting the request.");
            return StatusCode(500, new { message = "An error occurred while deleting the request", details = ex.Message });
        }
    }
    

    [HttpGet("ShowClaims")]
    public async Task<IActionResult> ShowClaims()
    {
        if(!_hostEnvironment.IsDevelopment()) 
            return NotFound();
        var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
        if (claims.Count == 0)
            return Ok("No claims found.");
        return Ok(new {claims = claims});
    }
}