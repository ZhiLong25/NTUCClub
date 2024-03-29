﻿// CartController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NTUCClub.Models;
using NTUCClub.Models.Cart;
using NTUCClub.Models.Products;
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

        [HttpGet("getcart/{email}")]
        public IActionResult GetCart(string email)
        {
            IQueryable<Cart> result = _context.CartItems
                    .Where(c => c.Email == email)
                    .Include(c => c.Service);

            if (result == null || !result.Any())
            {
                return NotFound("No cart items found for the provided email address.");
            }

            return Ok(result);
        }

        [HttpPost("addtocart")]
        public IActionResult AddToCart(Cart cartItem)
        {
            // Check if the item already exists in the cart
            var existingCartItem = _context.CartItems.FirstOrDefault(ci => ci.ServiceId == cartItem.ServiceId);

            var myCart = new Cart()
            {
                Email = cartItem.Email,
                ServiceId = cartItem.ServiceId,
                Service = _context.Services.FirstOrDefault(s => s.Id == cartItem.ServiceId),
                Quantity = cartItem.Quantity,
                Date = cartItem.Date,
            };

            if (existingCartItem != null)
            {
                // Update quantity if the item already exists
                myCart.Quantity += cartItem.Quantity;
            }
            else
            {
                // Add new item to the cart
                _context.CartItems.Add(myCart);
            }

            _context.SaveChanges();
            return Ok(myCart);
        }

        [HttpPut("updatecartitem/{id}")]
        public IActionResult UpdateCartItem(int id, Cart cartItem)
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