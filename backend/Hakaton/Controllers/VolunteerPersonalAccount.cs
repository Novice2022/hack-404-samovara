using Hakaton.DataAccess;
using Hakaton.DTO;
using Hakaton.Models;
using Hakaton.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                // Получаем активные заявки из базы данных
                var activeRequests = await _dbContext.Requests()
                    .Where(r => r.Status == 1) // Фильтруем только новые заявки
                    .Select(r => new Models.Request
                    {
                        Id = r.Id,
                        Type = r.Type,
                        Description = r.Description,
                        City = r.City,
                        LocationText = r.LocationText,
                        Status = r.Status,
                        CreatedAt = r.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss"),
                        Veteran = new VeteranDto
                        {
                            Id = r.Veteran.Id,
                            VolonteerId = r.Veteran.VolonteerId,
                            FirstNameVolonteer = r.Veteran.FirstNameVolonteer,
                            LastNameVolonteer = r.Veteran.LastNameVolonteer,
                            ContactInfo = r.Veteran.ContactInfo,
                            ResponseDate = r.Veteran.ResponseDate.ToString("yyyy-MM-ddTHH:mm:ss")
                        },
                        SelectedExecutorId = r.SelectedExecutorId
                    })
                    .ToListAsync();

                return Ok(activeRequests);
            }
            catch (UnauthorizedAccessException)
            {
                // Возвращаем ошибку авторизации
                return Unauthorized();
            }
            catch (Exception ex)
            {
                // Логируем ошибку (в реальном проекте используйте логгер)
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
