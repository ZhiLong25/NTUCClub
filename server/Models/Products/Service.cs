using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NTUCClub.Models.Products
{
    public class Service
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string? Image { get; set; }

        [Required, MinLength(3), MaxLength(100)]
        public string Name { get; set;} = string.Empty;

        [Required, MinLength(3), MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public float Price { get; set; }

        public float? MemPrice { get; set; }

        [Required]
        public string TimeSlots { get; set; }

        [Required]
        public int Slots { get; set; }

        [Required, MinLength(3), MaxLength(100)]
        public string Vendor { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }

    }
}
