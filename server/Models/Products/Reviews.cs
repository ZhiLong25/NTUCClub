using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NTUCClub.Models.Products
{
    public class Reviews
    {
        public int Id { get; set; }

        public int ServiceId { get; set; }

        [Required]
        public int Rating { get; set; }

        public string User { get; set; }

        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Media { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }

        //// Navigation property for the Service relationship
        //[ForeignKey("Service")]
        //public int ServiceId { get; set; }
        //public Service Service { get; set; }

    }
}
