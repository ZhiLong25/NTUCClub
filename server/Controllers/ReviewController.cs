using Microsoft.AspNetCore.Mvc;
using NTUCClub.Models.Products;

namespace NTUCClub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewController : Controller
    {
        private readonly MyDbContext _context;

        public ReviewController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("getreview")]
        public IActionResult GetAll()
        {
            IQueryable<Reviews> result = _context.Reviews;

            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(list);
        }

        [HttpGet("getreview/{serviceId}")]
        public IActionResult GetReviewsByServiceId(int serviceId)
        {
            var reviews = _context.Reviews
                .Where(r => r.ServiceId == serviceId)
                .ToList();

            if (reviews == null || !reviews.Any())
            {
                return NotFound(); 
            }

            return Ok(reviews); 
        }


        [HttpPost("addreview")]
        public IActionResult AddReview(Reviews reviews)
        {
            var now = DateTime.Now;

            var myReview = new Reviews()
            {
                ServiceId = reviews.ServiceId,
                Rating = reviews.Rating,
                User = reviews.User,
                Description = reviews.Description,
                Media = reviews.Media,
                CreatedAt = now,
                UpdatedAt = now,
            };

            _context.Reviews.Add(myReview);
            _context.SaveChanges();

            return Ok(myReview);
        }

        [HttpDelete("deleteReview/{id}")]
        public IActionResult DeleteWishlist(int id)
        {
            var myReview = _context.Reviews.Find(id);

            if (myReview == null)
            {
                return NotFound();
            }

            _context.Reviews.Remove(myReview);
            _context.SaveChanges();
            return Ok();
        }
    }
}
