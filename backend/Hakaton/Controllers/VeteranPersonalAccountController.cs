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
    private readonly IHostEnvironment _hostEnvironment; //for development status

    public VeteranPersonalAccountController(IJwtService jwtService, HakatonDbContext dbContext, ILogger<VeteranPersonalAccountController> logger, IHostEnvironment hostEnvironment)
    {
        _logger = logger;
        _dbContext = dbContext;
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
                VeteranId= Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value) //find current user from claims
            };
            _dbContext.Requests.Add(newRequest);
            await _dbContext.SaveChangesAsync();
            
            return Ok(new {RequestId = newRequest.Guid});
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while create request by the veteran.");
            return BadRequest(500);
        }
    }

    //REFACTOR THIS LATER AFTER CREATE RESPONSE!!! if it needs
    [HttpGet("requests/")]
    public async Task<IActionResult> GetRequests([FromQuery] FilterRequestContracts_ForVeterans? filterRequest)
    {
        try
        {
            var requests = _dbContext.Requests
                .Where(request => request.VeteranId == Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value))
                .ToList();

            var responsesWithUsers = _dbContext.Responses
                .Where(r => requests.Select(req => req.Guid).Contains(r.RequestId))
                .Join(_dbContext.Users,
                    response => response.VolonteerId,
                    user => user.Id,
                    (response, user) => new { response, user })
                .ToList();
            
            var responsesLookup = responsesWithUsers
                .ToLookup(x => x.response.RequestId);


            var requestDtosList = requests.Select(req => new RequestForVetransDtos
            {
                Guid = req.Guid,
                Type = req.Type,
                Description = req.Description,
                City = req.City,
                LocationText = req.LocationText,
                Status = req.Status,
                CreateAt = req.CreateAt,
                SelectedExecutorId = req.SelectedExecutorId,
                Responses = responsesLookup[req.Guid]
                    .Select(resp => new ResponseVononteerForVeteransDtos
                    {
                        Id = resp.response.Id,
                        VolonteerId = resp.response.VolonteerId,
                        FirstName = resp.user.FirstName,
                        LastName = resp.user.LastName,
                        ContactInfo = resp.user.PhoneNumber,
                        CreateAt = resp.response.CreateAt
                    }).ToList()
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
            Func<RequestForVetransDtos, object> selectorKey = filterRequest?.ColumnOrder?.ToLower() switch
            {
                "type" => requestDtosList => requestDtosList.Type,
                "status" => requestDtosList => requestDtosList.Status,
                "createAt" => requestDtosList => requestDtosList.CreateAt,
                "responses" => requestDtosList => requestDtosList.Responses!.Count,
                _ => requestDtosList => requestDtosList.Guid
            };
            
            //Выбор типа сортировки
            requestDtosList = filterRequest?.OrderByType == "desc" ? requestDtosList.OrderByDescending(selectorKey).ToList() : requestDtosList.OrderBy(selectorKey).ToList();

            
            return Ok(new { requests = requestDtosList});
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
            
            request.Status = RequestStatus.Cancelled;
            // _dbContext.Requests.Remove(request);
            _dbContext.Requests.Update(request);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Id = request.Guid });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting the request.");
            return StatusCode(500, new { message = "An error occurred while deleting the request", details = ex.Message });
        }
    }
    
    [HttpPost("requests/selectvolunteer/")]
    public async Task<IActionResult> AcceptResponse(Guid responseId)
    {
        try
        {
            Guid veteranId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var request_response = _dbContext.Requests
                .Join(_dbContext.Responses,
                    req => req.Guid,
                    res => res.RequestId,
                    (req, res) => new { req, res }
                    )
                .Where(rr => rr.res.Id == responseId).ToList();
            
            var request = request_response.Select(rr => rr.req).ToList().FirstOrDefault();
            
            if (request == null)
            {
                return NotFound($"Request with Guid {responseId} not found.");
            }
            
            var VolunteerUse = request_response
                .Join(_dbContext.Users,
                    arg => arg.res.VolonteerId,
                    user => user.Id,
                    (arg, user) => new { arg, user })
                .Select(vol => vol.user.Id).FirstOrDefault();
            
            request.Status = RequestStatus.InProgress; 
            request.SelectedExecutorId = VolunteerUse;
            
            _dbContext.Requests.Update(request);
            await _dbContext.SaveChangesAsync();
            
            return Ok(new {Id = request.SelectedExecutorId});
            
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while accept response by the veteran.");
            return BadRequest(500);
        }
    }

    [HttpPost("requests/selectvolunteer/finish")]
    public async Task<IActionResult> FinishRequest([FromBody] RequestFinishDTO requestId)
    {
        try
        {
            var request = await _dbContext.Requests.FindAsync(requestId.requestId);
            request.Status = RequestStatus.Completed;
            
            _dbContext.Requests.Update(request);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Id = request.Guid});
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while finish response by the veteran.");
            return BadRequest(500);
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