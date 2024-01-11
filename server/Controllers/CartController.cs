using Microsoft.AspNetCore.Mvc;
using NTUCClub.Models;
using System.Security.Claims;

namespace NTUCClub.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class CartController : ControllerBase
	{
		private readonly MyDbContext _context;
		public CartController(MyDbContext context)
		{
			_context = context;
		}

		[HttpGet("GetName/{name}")]
		public IActionResult GetCartItem(string name) 
		{
			var myCart = _context.Cart.Where(x => x.Activity_Name == name).ToArray();
			if (myCart == null) 
			{
				return NotFound();
			}
			return Ok(myCart);
		}

		[HttpGet("GetCartID/{id}")]
		public IActionResult GetCartById(int id) 
		{
			var myCart = _context.Cart.Where(x => x.Id == id);
			if (myCart == null) 
			{
				return NotFound();
			}
			return Ok(myCart);
		}

		[HttpGet]
		public IActionResult GetAll(string? search) 
		{
			IQueryable<Cart> result = _context.Cart;
			if (search != null)
			{
				result = result.Where(x => x.Activity_Name.Contains(search));
			}
			var list = result.OrderByDescending(x => x.CreatedAt).ToList();
			return Ok(list);
		}
	}
}
