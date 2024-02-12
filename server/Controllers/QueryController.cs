using Microsoft.AspNetCore.Mvc;
using NTUCClub.Models;
using NTUCClub.Models.Products;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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


        [HttpGet("GetQuery/{Email}")]
        public IActionResult GetVoucher(string Email)
        {
            var myQuery = _context.Queries.Where(x => x.Email == Email).ToArray();
            if (myQuery == null)
            {
                return NotFound();
            }
            return Ok(myQuery);
        }


        [HttpPost("Addquery")]

        public IActionResult AddQuery(Enquiery query)
        {
            Console.WriteLine("type here");
            var now = DateTime.Now;

            var myQuery = new Enquiery()
            {
                Email = query.Email.Trim(),
                QuerySubject = query.QuerySubject.Trim(),
                QueryDescription = query.QueryDescription.Trim(),
                CreatedAt = now,
                UpdatedAt = now
            };
            _context.Add(myQuery);
            _context.SaveChanges();
            return Ok(myQuery);
        }



        //[HttpPost("Replyquery")]
        //public IActionResult ReplyQuery(Query query)
        //{
        //    var existingQuery = _context.Queries.FirstOrDefault(q => q.Id == query.Id);

        //    if (existingQuery == null)
        //    {
        //        return NotFound(); // Return a 404 if the query is not found
        //    }

        //    // Assuming you receive the query reply content in the 'query.QueryReply' property
        //    existingQuery.QueryReply = query.QueryReply.Trim();
        //    existingQuery.UpdatedAt = DateTime.Now;

        //    _context.SaveChanges();

        //    return Ok(existingQuery);
        //}



        [HttpPut("QueryID")]

        public IActionResult UpdateQuery(int id, Enquiery query)
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