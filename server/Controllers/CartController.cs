using Microsoft.AspNetCore.Mvc;
using NTUCClub.Models.Cart;
using System.Collections.Generic;
using System.Linq;

namespace NTUCClub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CartController : ControllerBase
    {
        private readonly MyDbContext _context;

        public CartController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("getcart")]
        public IActionResult GetCart()
        {
            // Retrieve the cart items from the database
            var cartItems = _context.CartItems.ToList();
            return Ok(cartItems);
        }

        [HttpPost("addtocart")]
        public IActionResult AddToCart(CartItem cartItem)
        {
            // Check if the item already exists in the cart
            var existingCartItem = _context.CartItems.FirstOrDefault(ci => ci.ServiceId == cartItem.ServiceId);

            if (existingCartItem != null)
            {
                // Update quantity if the item already exists
                existingCartItem.Quantity += cartItem.Quantity;
            }
            else
            {
                // Add new item to the cart
                _context.CartItems.Add(cartItem);
            }

            _context.SaveChanges();
            return Ok();
        }

        [HttpPut("updatecartitem/{id}")]
        public IActionResult UpdateCartItem(int id, CartItem cartItem)
        {
            var existingCartItem = _context.CartItems.Find(id);
            if (existingCartItem == null)
            {
                return NotFound();
            }

            existingCartItem.Quantity = cartItem.Quantity;
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("removefromcart/{id}")]
        public IActionResult RemoveFromCart(int id)
        {
            var cartItem = _context.CartItems.Find(id);
            if (cartItem == null)
            {
                return NotFound();
            }

            _context.CartItems.Remove(cartItem);
            _context.SaveChanges();
            return Ok();
        }
    }
}
