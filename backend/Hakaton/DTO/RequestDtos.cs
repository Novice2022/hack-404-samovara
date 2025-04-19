using System.ComponentModel.DataAnnotations;
using Hakaton.Models;

namespace Hakaton.DTO;

public class RequestDtos
{
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

    public List<Response>? Responses;
}