using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NTUCClub.Models.Products
{
    public class Reviews
    {
        public int Id { get; set; }

        [Required]
        public int Rating { get; set; }

        public string? Description { get; set; } 

        [MaxLength(100)]
        public string? Media { get; set; } 

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;


        //// Navigation property for the Service relationship
        //[ForeignKey("Service")]
        //public int ServiceId { get; set; }
        //public Service Service { get; set; }

    }
}
