using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Hakaton.Models;

namespace Hakaton.DTO;

public record RequestCreateDtos()
{
    [Required]
    public RequestType Type { get; set; }
    // [MaxLength()] set this if u wanna validate description length
    [Required]
    public string Description { get; set; }
    [Required]
    public string City { get; set; }//Город
    [Required]
    public string LocationText { get; set; } //Адрес
};