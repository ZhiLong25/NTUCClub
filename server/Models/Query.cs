using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NTUCClub.Models
{
    public class Enquiry
    {
        public int Id { get; set; }

        [Required, MinLength(3), MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(500)]
        public string QuerySubject { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(500)]
        public string QueryDescription { get; set; } = string.Empty;

        //[Required, MinLength(3), MaxLength(500)]
        //public string QueryReply { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
        // Navigation property to represent the one-to-many relationship
        public User? User { get; set; } 

    }
}
