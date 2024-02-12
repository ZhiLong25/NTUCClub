using NTUCClub.Models.Products;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NTUCClub.Models.Cart
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        public int ServiceId { get; set; }

        [ForeignKey("ServiceId")]
        public Service Service { get; set; }

        public int Quantity { get; set; }

        public string Activity_Name {  get; set; }

        public float Activity_Price { get; set; }
    }
}
