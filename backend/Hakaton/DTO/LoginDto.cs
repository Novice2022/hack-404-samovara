using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Hakaton.DTO
{
    public class LoginDto
    {
        [NotNull]
        [MaxLength(50)]
        public string Login { get; set; }
        [NotNull]
        [MaxLength(257)]
        public string PasswordHash { get; set; }
    }
}
