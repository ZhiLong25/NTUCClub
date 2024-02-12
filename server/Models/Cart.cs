using NTUCClub.Models.Products;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NTUCClub.Models.Cart
{
    public class CartItem
    {
        [Key]
        public int ServiceId { get; set; }

        [ForeignKey("ServiceId")]
        public Service Service { get; set; }

        public int Quantity { get; set; }

        public DateTime Date { get; set; }

        public string Timeslot { get; set; }
    }
}