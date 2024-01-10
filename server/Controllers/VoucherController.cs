    using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;
using NTUCClub.Models;
using System.Security.Claims;

namespace NTUCClub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VoucherController : ControllerBase
    {
        private readonly MyDbContext _context;
        public VoucherController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetName/{name}")]
        public IActionResult GetVoucher(string name)
        {
            var myVoucher = _context.Vouchers.Where(x => x.Voucher_Name == name).ToArray();
            if (myVoucher == null)
            {
                return NotFound();
            }
            return Ok(myVoucher);
        }
        [HttpGet("GetVoucherID/{id}")]
        public IActionResult GetVoucherbyID(int id)
        {
            var myVoucher = _context.Vouchers.Where(x => x.Id == id);
            if (myVoucher == null)
            {
                return NotFound();
            }
            return Ok(myVoucher);
        }
        [HttpGet("GetID/{ActivityId}")]
        public IActionResult GetVoucherByActivityID(int ActivityId)
        {
            var myVoucher = _context.Vouchers.Where(x => x.Activity_ID == ActivityId).ToArray();


            if (myVoucher == null)
            {
                return NotFound();
            }
            return Ok(myVoucher);
        }

        [HttpGet]
        public IActionResult GetAll(string? search)
        {
            IQueryable<Voucher> result = _context.Vouchers;
            if (search != null)
            {
                result = result.Where(x => x.Voucher_Name.Contains(search)
                || x.Voucher_Details.Contains(search));
            }
            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(list);
        }

        [HttpPost("Addvoucher")]
        public IActionResult AddVoucher(Voucher voucher)
        {
            Console.WriteLine("here");
            var now = DateTime.Now;

            var myVoucher = new Voucher()
            {
                Voucher_Name = voucher.Voucher_Name.Trim(),
                Voucher_Details = voucher.Voucher_Details.Trim(),
                Voucher_Quantity = voucher.Voucher_Quantity,
                Voucher_Validity = voucher.Voucher_Validity,
                Activity_ID = voucher.Activity_ID,
                CreatedAt = now,
                UpdatedAt = now
            };
            _context.Vouchers.Add(myVoucher);
            _context.SaveChanges();
            return Ok(myVoucher);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateVoucher (int id, Voucher voucher)
        {
            var myVoucher = _context.Vouchers.Where(x => x.Id== id).FirstOrDefault(); 
            if (myVoucher == null)
            {
                return NotFound();
            }
            if (voucher.Voucher_Details!= null)
            {
               myVoucher.Voucher_Details = voucher.Voucher_Details.Trim();

            }
            if (voucher.Voucher_Name!= null) 
            {
                myVoucher.Voucher_Name = voucher.Voucher_Name.Trim();

            }
            if (voucher.Voucher_Validity != null)
            {
                myVoucher.Voucher_Validity = voucher.Voucher_Validity;
            }
            if (voucher.Voucher_Quantity != null)
            {
                myVoucher.Voucher_Quantity = voucher.Voucher_Quantity;
            }
            myVoucher.UpdatedAt = DateTime.Now;
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("deletebyID/{id}")]
        public IActionResult DeleteVoucherbyId(int id)
        {
            var myVoucher = _context.Vouchers.Where(x => x.Id == id).FirstOrDefault();
            if (myVoucher == null)
            {
                return NotFound();
            }
            _context.Vouchers.Remove(myVoucher);
            _context.SaveChanges();
            return Ok();
        }
        [HttpDelete("{name}")]
        public IActionResult DeleteVoucherbyName(string name)
        {
            var myVoucher = _context.Vouchers.Find(name);
            if (myVoucher == null)
            {
                return NotFound();
            }
            _context.Vouchers.Remove(myVoucher);
            _context.SaveChanges();
            return Ok();
        }
        private int GetUserId()
        {
            return Convert.ToInt32(User.Claims
            .Where(c => c.Type == ClaimTypes.NameIdentifier)
            .Select(c => c.Value).SingleOrDefault());
        }
    }
}

