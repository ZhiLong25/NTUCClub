using NTUCClub.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;

namespace NTUCClub.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        public UserController(MyDbContext context, IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterRequest request)
        {
            // Trim string values
            request.Name = request.Name.Trim();
            request.Email = request.Email.Trim().ToLower();
            request.Password = request.Password.Trim();
            request.Phone = request.Phone.Trim();
            Console.WriteLine(request.Password);

            // Check email
            var foundUser = _context.Users.FirstOrDefault(x => x.Email == request.Email);
            if (foundUser != null)
            {
                string message = "Email already exists.";
                return BadRequest(new { message });
            }

            // Check phone
            var foundUser1 = _context.Users.FirstOrDefault(x => x.Phone == request.Phone);
            if (foundUser1 != null)
            {
                string message = "Phone already exists.";
                return BadRequest(new { message });
            }

            // Create user object
            var now = DateTime.Now;
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            Console.WriteLine("PWHASH", passwordHash);
            var user = new User()
            {
                Name = request.Name,
                Email = request.Email,
                Password = passwordHash,
                Phone = request.Phone,
                ProfilePicture = request.ProfilePicture,
                CreatedAt = now,
                UpdatedAt = now,
                UserType = "Merchant"
            };
            Console.WriteLine("Password:",user.Password);
            

            return Ok(user);
        }

        [HttpPost("Verification")]
        public IActionResult Verification(User data)
        {
            Console.WriteLine(data.Password.ToString());
            Console.WriteLine(data);
            _context.Users.Add(data);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
        public IActionResult Login(LoginRequest request)
        {
            // Trim string values
            request.Email = request.Email.Trim().ToLower();
            request.Password = request.Password.Trim();
            // Check email and password
            string message = "Email or password is not correct.";
            var foundUser = _context.Users.Where(
            x => x.Email == request.Email).FirstOrDefault();
            if (foundUser == null)
            {
                return BadRequest(new { message });
            }
            bool verified = BCrypt.Net.BCrypt.Verify(
            request.Password, foundUser.Password);
            if (!verified)
            {
                return BadRequest(new { message });
            }
            // Return user info
            UserDTO userDTO = _mapper.Map<UserDTO>(foundUser);
            string accessToken = CreateToken(foundUser);
            LoginResponse response = new()
            {
                User = userDTO,
                AccessToken = accessToken
            };
            return Ok(response);
        }
        [HttpGet("findemail/{email}")]
        public IActionResult FindEmail(string email)
        {
            // Trim string values
            email = email.Trim().ToLower();
            string message = "No such Email registered.";

            var foundUser = _context.Users.Where(
                x => x.Email == email).FirstOrDefault();

            if (foundUser == null)
            {
                return BadRequest(new { message });
            }
            else
            {
                UserDTO userDTO = _mapper.Map<UserDTO>(foundUser);
                return Ok(userDTO);
            }
        }
        [HttpGet("userdetails/{id}")]
        public IActionResult userdetails(int id) {
            var foundUser = _context.Users.Where(
                x => x.Id == id).FirstOrDefault();
            if (foundUser == null)
            {
                return NotFound();
            }
            return Ok(foundUser);
        }

        [HttpPut("securitydetails/{id}")]
        public IActionResult ChangePassword(int id, UpdatePassword password)
        {
            
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password.Password.Trim());
            
            var foundUser = _context.Users.Where(
                x => x.Id == id).FirstOrDefault();
            Console.WriteLine(foundUser.Password);
            if (passwordHash != null)
            {
                foundUser.Password = passwordHash;
            }
            _context.SaveChanges();
            return Ok();

        }
        [HttpPut("updateDetails/{id}")]
        public IActionResult updateDetails(int id, User info) {
            Console.WriteLine(info.ProfilePicture);
            var foundUser = _context.Users.Where(
                x => x.Id == id).FirstOrDefault();
            if (foundUser == null)
            {
                return NotFound();
            }
            info.Email = info.Email.Trim();
            info.Name = info.Name.Trim();
            if (info.Email != null)
            {
                foundUser.Email = info.Email;
            }
            if (info.Name != null)
            {
                foundUser.Name = info.Name;
            }
            if (info.Phone != null)
            {
                foundUser.Phone = info.Phone;
            }
            if (info.ProfilePicture != null)
            {
                foundUser.ProfilePicture = info.ProfilePicture;
            }
            
            _context.SaveChanges();
            return Ok();
        }

        private string CreateToken(User user)
        {
            Console.WriteLine(user.UserType);

            string secret = _configuration.GetValue<string>(
            "Authentication:Secret");
            int tokenExpiresDays = _configuration.GetValue<int>(
            "Authentication:TokenExpiresDays");
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Upn , user.UserType)
            }) ,
                Expires = DateTime.UtcNow.AddDays(tokenExpiresDays),
                SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            string token = tokenHandler.WriteToken(securityToken);
            return token;
        }

        [HttpGet("auth"), Authorize]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        public IActionResult Auth()
        {
            var id = Convert.ToInt32(User.Claims.Where(
            c => c.Type == ClaimTypes.NameIdentifier)
            .Select(c => c.Value).SingleOrDefault());
            var name = User.Claims.Where(c => c.Type == ClaimTypes.Name)
            .Select(c => c.Value).SingleOrDefault();
            var email = User.Claims.Where(c => c.Type == ClaimTypes.Email)
            .Select(c => c.Value).SingleOrDefault();
            var usertype = User.Claims.Where(c => c.Type == ClaimTypes.Upn)
            .Select(c => c.Value).SingleOrDefault();
            if (id != 0 && name != null && email != null)
            {
                UserDTO userDTO = new() { Id = id, Name = name, Email = email,UserType = usertype };
                AuthResponse response = new() { User = userDTO };
                return Ok(response);
            }
            else
            {
                return Unauthorized();
            }
        }

        }

    }
