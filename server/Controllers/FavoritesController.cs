using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NTUCClub.Models.Products;

namespace NTUCClub.Controllers
{
    public class FavoritesController : Controller
    {
        private readonly MyDbContext _context;

        public FavoritesController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("getfavorites")]
        public IActionResult GetAll()
        {
            IQueryable<UserFavorites> result = _context.UserFavorites;

            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(list);
        }

        [HttpGet("getfavorites/{id}")]
        public IActionResult GetFavorites(int id)
        {
            UserFavorites? favorites = _context.UserFavorites.Find(id);
            if (favorites == null)
            {
                return NotFound();
            }
            return Ok(favorites);
        }


        [HttpPost("addfavorites")]
        public IActionResult AddFavorites(UserFavorites favorites)
        {
            var now = DateTime.Now;

            var myFavorites = new UserFavorites()
            {
                ActivityId = favorites.ActivityId,
                Activity = favorites.Activity,

         
                CreatedAt = now,
                UpdatedAt = now,
            };

            _context.UserFavorites.Add(myFavorites);
            _context.SaveChanges();

            return Ok(myFavorites);
        }

        [HttpDelete("deletefavorites/{id}")]
        public IActionResult DeleteFavorites(int id)
        {
            var myFavorites = _context.UserFavorites.Find(id);
            if (myFavorites == null)
            {
                return NotFound();
            }

            _context.UserFavorites.Remove(myFavorites);
            _context.SaveChanges();
            return Ok();
        }
    }
}
