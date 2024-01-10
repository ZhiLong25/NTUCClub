using System.ComponentModel.DataAnnotations;

namespace NTUCClub.Models
{
    public class UpdatePassword
    {
        [Required, MinLength(8), MaxLength(50)]
        public string Password { get; set; } = string.Empty;
    }
}
