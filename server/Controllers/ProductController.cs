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
        public IActionResult GetAll(string? search)
        {
            IQueryable<Service> result = _context.Services;
            if (search != null)
            {
                result = result.Where(x => x.Name.Contains(search) || x.Description.Contains(search));
            }

            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(list);
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
            var myService = new Service()
            {
                Image = service.Image,
                Name = service.Name.Trim(),
                Description = service.Description.Trim(),
                Price = service.Price,
                MemPrice = service.MemPrice,
                TimeSlots = service.TimeSlots.Trim(),
                Slots = service.Slots,
                Vendor = service.Vendor.Trim(),
                Category = service.Category.Trim(),
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.Services.Add(myService);
            _context.SaveChanges();
            return Ok(myService);
        }


        [HttpPut("updateservice/{id}")]
        public IActionResult UpdateService(int id, Service service)
        {
            var myService = _context.Services.Find(id);
            if (myService == null)
            {
                return NotFound();
            }

            myService.Name = service.Name.Trim();
            myService.Description = service.Description.Trim();
            myService.Price = service.Price;
            myService.MemPrice = service.MemPrice;
            myService.TimeSlots = service.TimeSlots.Trim();
            myService.Slots = service.Slots;
            myService.Vendor = service.Vendor.Trim();
            //myService.Category = service.Category.Trim();
            myService.UpdatedAt = DateTime.Now;

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

