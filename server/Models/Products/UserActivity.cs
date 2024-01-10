using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NTUCClub.Models.Products
{
    public class UserActivity
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Activity_Name { get; set; } = string.Empty;

        public string TimeSlot { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        //// Navigation property for the Services relationship
        //public List<Service> Services { get; set; }

    }
}
