using System.ComponentModel.DataAnnotations;
using Hakaton.Models;

namespace Hakaton.DTO;

public class RequestForVolunteersDtos
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
    [Required]
    public VeteranForVolunteersDtos Veteran { get; set; }
    public Guid? SelectedExecutorId {  get; set; }
}

public class VeteranForVolunteersDtos
{
    [Required]
    public Guid Id { get; set; }
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; }
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; }
    [Required]
    [MaxLength(17)]
    public string PhoneNumber { get; set; }
}

