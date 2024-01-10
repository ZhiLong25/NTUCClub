using Microsoft.AspNetCore.Mvc;
using NTUCClub.Models;
using System.Security.Claims;

namespace NTUCClub.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class CardController : ControllerBase
	{
		private readonly MyDbContext _context;

		public CardController(MyDbContext context)
		{
			_context = context;
		}

		[HttpGet("GetCardByName/{name}")]
		public IActionResult GetCardByName(string name)
		{
			var myCard = _context.Cards.Where(x => x.Card_Name == name).ToArray();
			if (myCard == null)
			{
				return NotFound();
			}
			return Ok(myCard);
		}

		[HttpGet("GetCardById/{id}")]
		public IActionResult GetCardById(int id)
		{
			var myCard = _context.Cards.Where(x => x.Id == id);
			if (myCard == null)
			{
				return NotFound();
			}
			return Ok(myCard);
		}

		[HttpGet]
		public IActionResult GetAllCards(string? search)
		{
			IQueryable<Card> result = _context.Cards;
			if (search == null)
			{
				result = result.Where(x => x.Card_Name.Contains(search)
				|| x.Card_Number.Contains(search));
			}
			var list = result.OrderByDescending(x => x.CreatedAt).ToList();
			return Ok(list);
		}

		[HttpPost("AddCard")]
		public IActionResult AddCard(Card card)
		{
			Console.WriteLine("here");
			var now = DateTime.Now;

			var myCard = new Card()
			{
				Card_Number = card.Card_Number.Trim(),
				Card_Name = card.Card_Name.Trim(),
				Cvv = card.Cvv.Trim(),
				First_Name = card.First_Name.Trim(),
				Last_Name = card.Last_Name.Trim(),
				CreatedAt = now,
				UpdatedAt = now
			};
			_context.Cards.Add(myCard);
			_context.SaveChanges();
			return Ok(myCard);
		}

		[HttpPut("UpdateCard")]
		public IActionResult UpdateCard(int id, Card card)
		{
			var myCard = _context.Cards.Where(x => x.Id == id).FirstOrDefault();
			if (myCard == null)
			{
				return NotFound();
			}
			if (card.Card_Number != null)
			{
				myCard.Card_Number = card.Card_Number.Trim();
			}
			if (card.Card_Name != null)
			{
				myCard.Card_Name = card.Card_Name.Trim();
			}
			if (card.Cvv != null)
			{
				myCard.Cvv = card.Cvv.Trim();
			}
			if (card.First_Name != null)
			{
				myCard.First_Name = card.First_Name.Trim();
			}
			if (card.Last_Name != null)
			{
				myCard.Last_Name = card.Last_Name.Trim();
			}
			myCard.UpdatedAt = DateTime.Now;
			_context.SaveChanges();
			return Ok();
		}

		[HttpDelete("DeleteCardById/{id}")]

		public IActionResult DeleteCardById(int id)
		{
			var myCard = _context.Cards.Where(x => x.Id == id).FirstOrDefault();
			if (myCard == null)
			{
				return NotFound();
			}
			_context.Cards.Remove(myCard);
			_context.SaveChanges();
			return Ok();
		}

		[HttpDelete("DeleteCardByNum/{number}")]
		public IActionResult DeleteCardByNum(string number)
		{
			var myCard = _context.Cards.Find(number);
			if (myCard == null)
			{
				return NotFound();
			}
			_context.Cards.Remove(myCard);
			_context.SaveChanges();
			return Ok();	
		}

	}
}
