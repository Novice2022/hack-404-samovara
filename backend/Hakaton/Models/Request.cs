using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hakaton.Models
{
    public class Request
    {
        [Key]
        [Required]
        public Guid Guid { get; set; }
        [Required]
        public RequestType Type { get; set; }
        [Required]
        [MaxLength(4000)]
        public string Description { get; set; }
        [Required]
        public string City { get; set; } //Город
        [Required]
        public string LocationText { get; set; } //Адрес
        [Required]
        public RequestStatus Status { get; set; }
        [Required]
        public DateTime CreateAt {  get; set; }
        [Required]
        public Guid VeteranId { get; set; }
        public Guid? SelectedExecutorId {  get; set; }
    }
    public enum RequestType
    {
        Medical = 1, 
        Document = 2,
        Transport = 3,
        Psychological = 4,
        Financial = 5,
        Food = 6,
        Other = 7
    }
    public enum RequestStatus
    {
        New = 1,
        InProgress = 2,
        Completed = 3,
        Cancelled = 4
    }
}
