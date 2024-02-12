using NTUCClub.Models.Products;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NTUCClub.Models.Cart
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }

        public string Email { get; set; }
        [Required]
        public int ServiceId { get; set; }

        [ForeignKey("ServiceId")]
        public Service Service { get; set; }

        public int Quantity { get; set; }

        public string Date { get; set; }

    }
}
