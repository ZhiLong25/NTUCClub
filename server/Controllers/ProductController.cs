using Microsoft.AspNetCore.Mvc;
using NTUCClub.Models.Products;
using Microsoft.AspNetCore.Authorization;
using NanoidDotNet;


namespace NTUCClub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ProductController(MyDbContext context)
        {
            _context = context;
        }


        [HttpGet("getservice")]
        public IActionResult GetAll(string? search, string? sort, string? category)
        {
            IQueryable<Service> result = _context.Services;
            if (search != null)
            {
                result = result.Where(x => x.Name.Contains(search) || x.Description.Contains(search) || x.Vendor.Contains(search));
            }

            if (sort != null)
            {
                switch (sort)
                {
                    case "recentlyadded":
                        result = result.OrderByDescending(x => x.CreatedAt);
                        break;

                    case "atoz":
                        result = result.OrderBy(x => x.Name); 
                        break;

                    case "ztoa":
                        result = result.OrderByDescending(x => x.Name); 
                        break;

                    case "priceAsc":
                        result = result.OrderBy(x => x.Price);
                        break;

                    case "priceDesc":
                        result = result.OrderByDescending(x => x.Price);
                        break;
                }
            }

            if (category != null)
            {
                string[] selectedCat = category.Split(',');

                result = result.Where(service => selectedCat.Contains(service.Category));

            }

            // var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(result);
        }

        [HttpGet("getservice/{id}")]
        public IActionResult GetService(int id)
        {
            Service? service = _context.Services.Find(id);
            if (service == null)
            {
                return NotFound();
            }
            return Ok(service);
        }


        [HttpPost("addservice")]
        public IActionResult AddService(Service service)
        {
            var now = DateTime.Now;

            // Fetch or create the category based on the service.Category value
            //var category = _context.Category.FirstOrDefault(c => c.Name == service.Category.Trim())
            //              ?? new Category { Name = service.Category.Trim() };

            var myService = new Service()
            {
                Image = service.Image,
                Name = service.Name.Trim(),
                Description = service.Description.Trim(),
                Category = service.Category,
                Location = service.Location,
                Price = service.Price,
                MemPrice = service.MemPrice,
                TimeSlots = service.TimeSlots,
                Slots = service.Slots,
                Vendor = service.Vendor.Trim(),
                CreatedAt = now,
                UpdatedAt = now,
            };

            _context.Services.Add(myService);
            _context.SaveChanges();

            return Ok(myService);
        }


        [HttpPut("updateservice/{id}")]
        public IActionResult UpdateService(int id, Service service)
        {

            // Fetch or create the category based on the service.Category value
            //var category = _context.Category.FirstOrDefault(c => c.Name == service.Category.Trim())
            //              ?? new Category { Name = service.Category.Trim() };

            var myService = _context.Services.Find(id);
            if (myService == null)
            {
                return NotFound();
            }

            myService.Name = service.Name.Trim();
            myService.Description = service.Description.Trim();
            myService.Price = service.Price;
            myService.MemPrice = service.MemPrice;
            myService.Location = service.Location;
            myService.TimeSlots = service.TimeSlots;
            myService.Slots = service.Slots;
            myService.Vendor = service.Vendor.Trim();
            myService.UpdatedAt = DateTime.Now;
            myService.Category = service.Category;
            myService.Image = service.Image;

            _context.SaveChanges();
            return Ok();
        }


        [HttpDelete("deleteservice/{id}")]
        public IActionResult DeleteService(int id)
        {
            var myService = _context.Services.Find(id);
            if (myService == null)
            {
                return NotFound();
            }

            _context.Services.Remove(myService);
            _context.SaveChanges();
            return Ok();
        }

    }
}

