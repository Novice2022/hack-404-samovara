using Hakaton.DataAccess;
using Hakaton.DTO;
using Hakaton.Models;
using Hakaton.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Hakaton.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize(Roles = "VOLUNTEER")]
    public class VolunteerPersonalAccount : Controller
    {
        private readonly HakatonDbContext _dbContext;
        private readonly ILogger<AuthorizationController> _logger;
        public VolunteerPersonalAccount(HakatonDbContext dbContext, ILogger<AuthorizationController> logger)
        {
            _logger = logger;
            _dbContext = dbContext;
        }
        [HttpGet("requests/active")]
        public async Task<IActionResult> GetRequestActive()
        {
            try
            {
                var requests = await _dbContext.Requests
                    .Join(
                        _dbContext.Users,
                        request => request.VeteranId,
                        user => user.Id,
                        (request, user) => new RequestDtoVolunteerController
                        {
                            Id = request.Guid,
                            Type = request.Type,
                            Description = request.Description,
                            City = request.City,
                            LocationText = request.LocationText,
                            Status = request.Status,
                            CreateAt = request.CreateAt,
                            Veteran = new VeteranDtoVolunteerController
                            {
                                Id = user.Id,
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                PhoneNumber = user.PhoneNumber,
                                CityResidence = user.CityResidence
                            },
                            SelectedExecutorId = request.SelectedExecutorId
                        }
                    )
                    .Where(r => r.Veteran != null)
                    .ToListAsync();

                return Ok(requests);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        public async Task<IActionResult> RespondToRequest(
            [FromRoute] Guid request_id,
            [FromBody] ResponseRequestDtoVolunteerController responseRequestDto)
        {
            try
            {
                var request = await _dbContext.Requests
                    .FirstOrDefaultAsync(r => r.Guid == request_id);

                if (request == null)
                {
                    return NotFound("Заявка не найдена.");
                }

                if (request.Status != RequestStatus.New)
                {
                    return BadRequest("Отклик возможен только на новые заявки.");
                }

                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value).ToString();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Не удалось определить пользователя.");
                }

                var volunteerId = Guid.Parse(userId);

                Response response = new Response()
                {
                    Id = Guid.NewGuid(),
                    RequestId = request_id,
                    ContactInfo = responseRequestDto.ContactInfo,
                    VolonteerId = volunteerId,
                    CreateAt = DateTime.UtcNow
                };

                await _dbContext.SaveChangesAsync();

                return Ok();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpGet("requests/filter")]
        [ProducesResponseType(401)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> FilterRequests(
        [FromQuery] int? type,
        [FromQuery] string city)
        {
            try
            {
                if (string.IsNullOrEmpty(city))
                {
                    return BadRequest("Параметр 'city' обязателен.");
                }

                var query = _dbContext.Requests
                    .Join(
                        _dbContext.Users,
                        request => request.VeteranId,
                        user => user.Id,
                        (request, user) => new
                        {
                            request.Guid,
                            request.Type,
                            request.Description,
                            request.City,
                            request.LocationText,
                            request.Status,
                            request.CreateAt,
                            Veteran = new
                            {
                                user.Id,
                                Name = $"{user.FirstName} {user.LastName}",
                                ContactInfo = user.PhoneNumber,
                                CityResidence = user.CityResidence
                            },
                            request.SelectedExecutorId
                        }
                    )
                    .Where(r => r.City == city); // Фильтруем по городу

                // Если указан тип помощи, добавляем фильтр по типу
                if (type.HasValue)
                {
                    query = query.Where(r => r.Type == type.Value);
                }

                // Получаем отфильтрованные заявки
                var requests = await query
                    .Select(r => new RequestDtoVolunteerController
                    {
                        Id = r.Guid,
                        Type = r.Type,
                        Description = r.Description,
                        City = r.City,
                        LocationText = r.LocationText,
                        Status = r.Status,
                        CreatedAt = r.CreateAt.ToString("yyyy-MM-ddTHH:mm:ss"),
                        Veteran = new VeteranDto
                        {
                            Id = r.Veteran.Id,
                            Name = r.Veteran.Name,
                            ContactInfo = r.Veteran.ContactInfo,
                            CityResidence = r.Veteran.CityResidence
                        },
                        SelectedExecutorId = r.SelectedExecutorId
                    })
                    .ToListAsync();

                // Формируем ответ
                var response = new FilteredRequestsResponse
                {
                    Requests = requests
                };

                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
