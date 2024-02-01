using Microsoft.AspNetCore.Mvc;
using NTUCClub.Models.Products;

namespace NTUCClub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TimeslotController : Controller
    {
        private readonly MyDbContext _context;

        public TimeslotController(MyDbContext context)
        {
            _context = context;
        }


        [HttpGet("gettimeslots")]
        public IActionResult GetAll(string? search)
        {
            IQueryable<Timeslots> result = _context.Timeslots;
            if (search != null)
            {
                result = result.Where(x => x.Timeslot.Contains(search));
            }

            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(list);
        }


        [HttpPost("addtimeslots")]
        public IActionResult AddTimeslot(Timeslots timeslot)
        {

            var now = DateTime.Now;
            var myTimeslot = new Timeslots()
            {
                Timeslot = timeslot.Timeslot.Trim(),
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.Timeslots.Add(myTimeslot);
            _context.SaveChanges();
            return Ok(myTimeslot);
        }


        [HttpPut("updatetimeslots/{id}")]
        public IActionResult UpdateTimeslot(int id, Timeslots timeslot)
        {
            var myTimeslot = _context.Timeslots.Find(id);
            if (myTimeslot == null)
            {
                return NotFound();
            }

            // Update Image
            myTimeslot.Timeslot = timeslot.Timeslot.Trim();
            myTimeslot.UpdatedAt = DateTime.Now;

            _context.SaveChanges();
            return Ok();
        }


        [HttpDelete("deletetimeslots/{id}")]
        public IActionResult DeleteTimeslots(int id)
        {
            var myTimeslot = _context.Timeslots.Find(id);
            if (myTimeslot == null)
            {
                return NotFound();
            }

            _context.Timeslots.Remove(myTimeslot);
            _context.SaveChanges();
            return Ok();
        }
    }
}
