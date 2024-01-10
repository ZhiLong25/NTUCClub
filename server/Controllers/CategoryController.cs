using Microsoft.AspNetCore.Mvc;
using NTUCClub.Models.Products;

namespace NTUCClub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoryController : Controller
    {
        private readonly MyDbContext _context;

        public CategoryController(MyDbContext context)
        {
            _context = context;
        }


        [HttpGet("getcategory")]
        public IActionResult GetAll(string? search)
        {
            IQueryable<Category> result = _context.Category;
            if (search != null)
            {
                result = result.Where(x => x.Name.Contains(search));
            }

            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(list);
        }

        [HttpGet("getcategory/{id}")]
        public IActionResult GetCategory(int id)
        {
            Category? category = _context.Category.Find(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }


        [HttpPost("addcategory")]
        public IActionResult AddCategory(Category category)
        {

            var now = DateTime.Now;
            var myCategory = new Category()
            {
                Image = category.Image,
                Name = category.Name.Trim(),
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.Category.Add(myCategory);
            _context.SaveChanges();
            return Ok(myCategory);
        }


        [HttpPut("updatecategory/{id}")]
        public IActionResult UpdateCategory(int id, Category category)
        {
            var myCategory = _context.Category.Find(id);
            if (myCategory == null)
            {
                return NotFound();
            }

            // Update Image
            myCategory.Name = category.Name.Trim();
            myCategory.UpdatedAt = DateTime.Now;

            _context.SaveChanges();
            return Ok();
        }


        [HttpDelete("deletecategory/{id}")]
        public IActionResult DeleteCategory(int id)
        {
            var myCategory = _context.Category.Find(id);
            if (myCategory == null)
            {
                return NotFound();
            }

            _context.Category.Remove(myCategory);
            _context.SaveChanges();
            return Ok();
        }
    }
}
