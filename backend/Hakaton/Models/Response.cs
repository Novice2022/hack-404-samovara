using System.ComponentModel.DataAnnotations;

namespace Hakaton.Models
{
    public class Response
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        [Required]
        public Guid VolonteerId { get; set; }
        [Required]
        public Guid RequestId { get; set; }
        [Required]
        public string ContactInfo { get; set; }
        [Required]
        public DateTime CreateAt { get; set; }
    }
}
