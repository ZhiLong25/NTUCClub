using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace NTUCClub.Models
{
    public class Voucher
    {
        public int Id { get; set; }

        [Required, MinLength(3), MaxLength(100)]
        public string Voucher_Name { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(500)]
        public string Voucher_Details { get; set; } = string.Empty;
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Voucher_Quantity must be greater than or equal to 1.")]
        public int Voucher_Quantity { get; set; } 
        [Column(TypeName = "datetime")]
        public DateTime Voucher_Validity { get; set; } 
        public int? Activity_ID { get; set; } 
        public int User_ID { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
        // Navigation property to represent the one-to-many relationship
        public User? User { get; set; }
    }
}
