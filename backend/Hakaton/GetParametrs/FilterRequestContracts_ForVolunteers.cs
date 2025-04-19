using System.ComponentModel.DataAnnotations;
using Hakaton.Models;

namespace Hakaton.GetParametrs;

public record FilterRequestContracts_ForVolunteers(
        string? ColumnOrder,
        [MinLength(3)]
        [MaxLength(4)]
        string? OrderByType,
        [Range(1,7)]
        RequestType? Type,
        DateTime? createdAt,
        string? City
                );