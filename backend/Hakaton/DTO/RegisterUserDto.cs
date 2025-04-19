using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

public class RegisterUserDto
{
    [Required(ErrorMessage = "First name is required.")]
    [RegularExpression(@"^[a-zA-Zа-яА-ЯёЁ]+$", ErrorMessage = "First name must contain only letters.")]
    public string FirstName { get; set; }

    [Required(ErrorMessage = "Last name is required.")]
    [RegularExpression(@"^[a-zA-Zа-яА-ЯёЁ]+$", ErrorMessage = "Last name must contain only letters.")]
    public string LastName { get; set; }

    [Required(ErrorMessage = "Login is required.")]
    [StringLength(50, ErrorMessage = "Login cannot exceed 50 characters.")]
    public string Login { get; set; }

    [Required(ErrorMessage = "Password is required.")]
    [MinLength(0, ErrorMessage = "Password must be at least 6 characters long.")] //добавить ограничение 32 или 16. алгоритм ещё не выбран
    public string PasswordHash { get; set; }
    [Required]
    [Phone(ErrorMessage = "Invalid phone number format.")]
    public string PhoneNumber { get; set; }

    [Required(ErrorMessage = "City of residence is required.")]
    [RegularExpression(@"^[a-zA-Zа-яА-ЯёЁ\s\-]+$", ErrorMessage = "City name must contain only letters, spaces, or hyphens.")]
    public string CityResidence { get; set; }
    [Required]
    [Range(1, 2, ErrorMessage = "Role must be either 1 (Veteran) or 2 (Volunteer).")]
    public int Role { get; set; }
}