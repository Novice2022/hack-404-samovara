using System.ComponentModel.DataAnnotations;
using Hakaton.Models;

namespace Hakaton.GetParametrs;

public record FilterRequestContracts(
    string? ColumnOrder,
    [MinLength(3)]
    [MaxLength(4)]
    string? OrderByType,
    [Range(1,7)]
    RequestType? Type,
    [Range(1,4)]
    RequestStatus? Status,
    DateTime? createdAt
    //Add lower new filter-parameters (add filter-logic in Controller-action)
    );