using Hakaton.Models;

namespace Hakaton.Services
{
    public interface IJwtService
    {
        public string GenerateToken(Guid userId, UserRole role);
    }
}
