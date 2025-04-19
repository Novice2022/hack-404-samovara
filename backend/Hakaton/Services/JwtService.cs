using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Hakaton.Models;

namespace Hakaton.Services
{
    public class JwtService : IJwtService
    {
        private readonly SymmetricSecurityKey _securityKey;
        private readonly string? _issuer;
        private readonly string? _audience;

        public JwtService(SymmetricSecurityKey securityKey, IConfiguration configuration)
        {
            // byte[]? key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]);
            // _securityKey = new SymmetricSecurityKey(key);
            _securityKey = securityKey;
            _issuer = configuration["Jwt:Issuer"];
            _audience = configuration["Jwt:Audience"];
        }

        /// <summary>
        /// Генерирует JWT-токен для пользователя с указанием роли.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="role">Роль пользователя (например, "Veteran" или "Volunteer").</param>
        /// <returns>JWT-токен в виде строки.</returns>
        public string GenerateToken(Guid userId, UserRole role)
        {
            var signingCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256);

            Claim[] claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Role, role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}