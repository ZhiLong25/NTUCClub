using Microsoft.AspNetCore.Mvc;
using NTUCClub.Models.Products;

namespace NTUCClub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VendorController : Controller
    {
        private readonly MyDbContext _context;

        public VendorController(MyDbContext context)
        {
            _context = context;
        }


        [HttpGet("getvendor")]
        public IActionResult GetAll(string? search)
        {
            IQueryable<Vendor> result = _context.Vendor;
            if (search != null)
            {
                result = result.Where(x => x.Name.Contains(search));
            }

            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(list);
        }

        [HttpGet("getvendor/{id}")]
        public IActionResult GetVendor(int id)
        {
            Vendor? vendor = _context.Vendor.Find(id);
            if (vendor == null)
            {
                return NotFound();
            }
            return Ok(vendor);
        }


        [HttpPost("addvendor")]
        public IActionResult AddVendor(Vendor vendor)
        {

            var now = DateTime.Now;
            var myVendor = new Vendor()
            {
                Image = vendor.Image,
                Name = vendor.Name.Trim(),
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.Vendor.Add(myVendor);
            _context.SaveChanges();
            return Ok(myVendor);
        }


        [HttpPut("updatevendor/{id}")]
        public IActionResult UpdateVendor(int id, Vendor vendor)
        {
            var myVendor = _context.Vendor.Find(id);
            if (myVendor == null)
            {
                return NotFound();
            }

            // Update Image
            myVendor.Name = vendor.Name.Trim();
            myVendor.UpdatedAt = DateTime.Now;

            _context.SaveChanges();
            return Ok();
        }


        [HttpDelete("deletevendor/{id}")]
        public IActionResult DeleteVendor(int id)
        {
            var myVendor = _context.Vendor.Find(id);
            if (myVendor == null)
            {
                return NotFound();
            }

            _context.Vendor.Remove(myVendor);
            _context.SaveChanges();
            return Ok();
        }
    }
}
