using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NTUCClub.Models.Products;

namespace NTUCClub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WishlistController : Controller
    {
        private readonly MyDbContext _context;

        public WishlistController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("getwishlist/{user}")]
        public IActionResult GetAll(string user)
        {
            try
            {
                // Retrieve the wish list items for the specified user from the database
                IQueryable<Wishlist> result = _context.Wishlist
                    .Where(w => w.User == user)
                    .Include(w => w.Service); 

                var list = result.OrderByDescending(x => x.CreatedAt).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                // Handle any exceptions and return an error response
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("getwishlist/{user}/{serviceId}")]
        public IActionResult GetFavorites(string user, int serviceId)
        {
            var wishlistItems = _context.Wishlist.Where(w  => w.User == user && w.ServiceId == serviceId).ToList();

            if (wishlistItems == null || wishlistItems.Count == 0)
            {
                return NotFound();
            }

            return Ok(wishlistItems);
        }


        [HttpPost("addwishlist")]
        public IActionResult AddWishlist(Wishlist wishlist)
        {
            var now = DateTime.Now;

            var myWishlist = new Wishlist()
            {
                User = wishlist.User,
                ServiceId = wishlist.ServiceId,
                CreatedAt = now,
                UpdatedAt = now,
                Service = _context.Services.FirstOrDefault(s => s.Id == wishlist.ServiceId) // Assuming you have a Services DbSet in your context

            };

            _context.Wishlist.Add(myWishlist);
            _context.SaveChanges();

            return Ok(myWishlist);
        }

        [HttpDelete("deletewishlist/{user}/{serviceid}")]
        public IActionResult DeleteWishlist(string user, int serviceid)
        {
            var wishlistItems = _context.Wishlist
                .Where(w => w.User == user && w.ServiceId == serviceid)
                .Include(w => w.Service) // Include the related service details
                .ToList();

            if (wishlistItems == null)
            {
                return NotFound();
            }

            foreach (var item in wishlistItems)
            {
                _context.Wishlist.Remove(item);
            }

            _context.SaveChanges();
            return Ok();
        }
    }
}
