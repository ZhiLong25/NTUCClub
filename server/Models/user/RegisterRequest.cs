using System.ComponentModel.DataAnnotations;

namespace NTUCClub.Models.user
{
    public class RegisterRequest
    {
        [Required, MinLength(3), MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z '-,.]+$",
        ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string Name { get; set; } = string.Empty;
        [Required, EmailAddress, MaxLength(50)]
        public string Email { get; set; } = string.Empty;
        [Required, MinLength(8), MaxLength(100)]
        [RegularExpression(@"^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$",
        ErrorMessage = "At least 1 letter and 1 number")]
        public string Password { get; set; } = string.Empty;

        [StringLength(15, MinimumLength = 7, ErrorMessage = "Phone number must be between 7 and 15 digits.")]
        [RegularExpression(@"^\d*$", ErrorMessage = "Please enter a valid phone number.")]
        public string Phone { get; set; } = string.Empty;
        [MaxLength(100)]
        public string? ProfilePicture { get; set; } = string.Empty;
    }
}
