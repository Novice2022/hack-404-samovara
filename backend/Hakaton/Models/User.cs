using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Hakaton.Models
{
    public class User
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }
        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }
        [Required]
        [MaxLength(50)]
        public string Login {  get; set; }
        [Required]
        [MaxLength(257)]
        public string PasswordHash { get; set; }
        [Required]
        [MaxLength(17)]
        public string PhoneNumber { get; set; }
        [Required]
        [MaxLength(100)]
        public string CityResidence { get; set; }
        [Required]
        public UserRole Role {  get; set; }
        [Required]
        public DateTime RegistrationDate { get; set; }
    }
    public enum UserRole
    {
        VETERAN = 1,
        VOLUNTEER = 2
    }
}
