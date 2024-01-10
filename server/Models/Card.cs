using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NTUCClub.Models
{
	public class Card
	{
		public int Id { get; set; }

		[Required, MinLength(15), MaxLength(16)]
		public string Card_Number { get; set; } = string.Empty;

		[Required, MaxLength(30)]
		public string Card_Name { get; set; } = string.Empty;

		[Required, MaxLength(3)]
		public string Cvv {  get; set; } = string.Empty;

		[Required, MinLength(3), MaxLength(30)] 
		public string First_Name { get; set; } = string.Empty;

		[Required, MinLength(3), MaxLength(50)]
		public string Last_Name { get; set;} = string.Empty;

		[Column(TypeName = "datetime")]
		public DateTime CreatedAt { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; }

		// Navigation property to represent the one-to-many relationship
		public User? User { get; set; }
	}
}
