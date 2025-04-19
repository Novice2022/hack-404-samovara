using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Hakaton.Models
{
    public class Response
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        // [Required]
        // public Guid VolonteerId { get; set; }
        [Required]
        public Guid RequestId { get; set; }
        [Required]
        public string ContactInfo { get; set; }
        [Required]
        public DateTime CreateAt { get; set; }

        [ForeignKey("RequestId")]
        public virtual Request? Request { get; set; }
        public Guid? SelectedExecutorId {  get; set; }
        [ForeignKey("SelectedExecutorId")]
        public virtual User SelectedExecutor {  get; set; }
    }
}
