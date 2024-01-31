using NTUCClub.Models.user;

namespace NTUCClub.Models
{
    public class AuthResponse
    {
        public UserDTO User { get; set; } = new UserDTO();
    }
}
