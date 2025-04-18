using Hakaton.DataAccess;
using Hakaton.DTO;
using Hakaton.Models;
using Hakaton.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hakaton.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AuthorizationController : Controller
    {
        private readonly HakatonDbContext _dbContext;
        private readonly ILogger<AuthorizationController> _logger;
        private readonly IJwtService _jwtService;

        public AuthorizationController(IJwtService jwtService, HakatonDbContext dbContext, ILogger<AuthorizationController> logger)
        {
            _logger = logger;
            _dbContext = dbContext;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
        {
            if (await _dbContext.Users.AnyAsync(u => u.Login == registerUserDto.Login))
            {
                return BadRequest("Registration failed. The username is incorrect.");
            }

            try
            {
                User newUser = new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = registerUserDto.FirstName,
                    LastName = registerUserDto.LastName,
                    Login = registerUserDto.Login,
                    PasswordHash = registerUserDto.PasswordHash,
                    PhoneNumber = registerUserDto.PhoneNumber,
                    CityResidence = registerUserDto.CityResidence,
                    Role = (UserRole)registerUserDto.Role,
                    RegistrationDate = DateTime.UtcNow,
                };

                _dbContext.Users.Add(newUser);
                await _dbContext.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while registering the user.");
                return BadRequest(500);
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            User? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Login == loginDto.Login);

            if (user == null || user.PasswordHash != loginDto.PasswordHash)
            {
                return BadRequest("Invalid username or password.");
            }

            string token = _jwtService.GenerateToken(user.Id, user.Role);

            return Ok(new { token, userId = user.Id, role = user.Role });
        }
    }
}
