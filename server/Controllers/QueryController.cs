using Microsoft.AspNetCore.Mvc;
using NTUCClub.Models;
using NTUCClub.Models.Products;

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

        [HttpGet("GetQueryID/{id}")]
        public IActionResult GetQuerybyID(int id)
        {
            var myQuery = _context.Queries.Where(x => x.Id == id);
            if (myQuery == null)
            {
                return NotFound();
            }
            return Ok(myQuery);
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
            _context.Queries.Add(myQuery);
            _context.SaveChanges();
            return Ok(myQuery);
        }
        [HttpPut("QueryID/{id}")]
        public IActionResult UpdateQuery(int id, Query query)
        {
            var myQuery = _context.Queries.Where(x => x.Id == id).FirstOrDefault();
            if (myQuery == null)
            {
                return NotFound();
            }
            if (query.Email != null)
            {
                myQuery.Email = query.Email.Trim();

            }
            if (query.QuerySubject != null)
            {
                myQuery.QuerySubject = query.QuerySubject.Trim();

            }
            if (query.QueryDescription != null)
            {
                myQuery.QueryDescription = query.QueryDescription.Trim();
            }
        
            myQuery.UpdatedAt = DateTime.Now;
            _context.SaveChanges();
            return Ok();
        }
        [HttpDelete("DeletequeryID/{id}")]
        public IActionResult DeleteQueryById(int id)
        {
            var myQuery = _context.Queries.FirstOrDefault(x => x.Id == id);
            if (myQuery == null)
            {
                return NotFound();
            }

            _context.Queries.Remove(myQuery);
            _context.SaveChanges();
            return Ok();
        }


   }
}
