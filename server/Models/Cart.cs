using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NTUCClub.Models
{
	public class Cart
	{
		public int Id { get; set; }

		[Required]
		public string Activity_Name { get; set; } = string.Empty;

		[Required]
		public float Activity_Price { get; set; }

		[Required]
		public int Quantity { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime CreatedAt { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; }

		// Navigation property to represent the one-to-many relationship
		public User? User { get; set; }

		//[ForeignKey("User")]

	}
}
