using System.ComponentModel.DataAnnotations;

namespace Hakaton.DTO;

public class ResponseCreateDtos
{
    [Required]
    public Guid Guid { get; set; }
}