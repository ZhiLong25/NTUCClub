//using Microsoft.AspNetCore.Mvc;
//using NTUCClub.Models.Products;

//namespace NTUCClub.Controllers
//{
//    [ApiController]
//    [Route("[controller]")]
//    public class WishlistController : Controller
//    {
//        private readonly MyDbContext _context;

//        public WishlistController(MyDbContext context)
//        {
//            _context = context;
//        }

//        [HttpGet("getwishlist")]
//        public IActionResult GetAll()
//        {
//            IQueryable<Wishlist> result = _context.Wishlist;

//            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
//            return Ok(list);
//        }

//        [HttpGet("getwishlist/{id}")]
//        public IActionResult GetFavorites(int id)
//        {
//            Wishlist? wishlist = _context.Wishlist.Find(id);
//            if (wishlist == null)
//            {
//                return NotFound();
//            }
//            return Ok(wishlist);
//        }


//        [HttpPost("addwishlist")]
//        public IActionResult AddWishlist(Wishlist wishlist)
//        {
//            var now = DateTime.Now;

//            var myWishlist = new Wishlist()
//            {
//                User = wishlist.User,
//                ServiceId = wishlist.ServiceId,
//                CreatedAt = now,
//                UpdatedAt = now,
//            };

//            _context.Wishlist.Add(myWishlist);
//            _context.SaveChanges();

//            return Ok(myWishlist);
//        }

//        [HttpDelete("deletewishlist/{ServiceId}")]
//        public IActionResult DeleteWishlist(int serviceid) 
//        {
//            var myWishlist = _context.Wishlist.FirstOrDefault(w => w.ServiceId == serviceid);

//            if (myWishlist == null)
//            {
//                return NotFound();
//            }

//            _context.Wishlist.Remove(myWishlist);
//            _context.SaveChanges();
//            return Ok();
//        }
//    }
//}
