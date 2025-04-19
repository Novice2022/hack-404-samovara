using System.ComponentModel.DataAnnotations;

namespace Hakaton.DTO
{
    public class ResponseRequestDtoVolunteerController
    {
        [Required]
        public string ContactInfo { get; set; }
    }
}
