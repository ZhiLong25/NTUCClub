using Microsoft.AspNetCore.Mvc;
using NTUCClub.Models;

namespace NTUCClub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QueryController : ControllerBase
    {
        private readonly MyDbContext _context;

        public QueryController(MyDbContext context)
        {
            _context = context;
        }

        [HttpPost("Addquery")]

        public IActionResult AddQuery(Query query)
        {
            Console.WriteLine("type here");
            var now = DateTime.Now;

            var myQuery = new Query()
            {
                Email = query.Email.Trim(),
                QuerySubject = query.QuerySubject.Trim(),
                QueryDescription = query.QueryDescription.Trim(),
                CreatedAt = now,
                UpdatedAt = now
            };
            _context.Vouchers.Add(myQuery);
            _context.SaveChanges();
            return Ok(myQuery);
        }


    }
}
