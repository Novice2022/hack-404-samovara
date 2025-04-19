using Hakaton.DTO;
using Hakaton.Models;

public class RequestDtoVolunteerController
{
    public Guid Id { get; set; }
    public RequestType Type { get; set; }
    public string Description { get; set; }
    public string City { get; set; }
    public string LocationText { get; set; }
    public RequestStatus Status { get; set; }
    public DateTime CreateAt { get; set; }
    public VeteranDtoVolunteerController Veteran { get; set; }
    public Guid? SelectedExecutorId { get; set; }
}