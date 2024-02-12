using NTUCClub.Models;
using Microsoft.EntityFrameworkCore;
using NTUCClub.Models.Products;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using NTUCClub.Models.Cart;

namespace NTUCClub
{
    public class MyDbContext : DbContext
    {
        private readonly IConfiguration _configuration;
        public MyDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder
        optionsBuilder)
        {
            string? connectionString = _configuration.GetConnectionString(
            "MyConnection");
            if (connectionString != null)
            {
                optionsBuilder.UseMySQL(connectionString);
            }
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }

        public DbSet<Service> Services { get; set; }

        // public DbSet<Category> Category { get; set; }
        public DbSet<Vendor> Vendor { get; set; }

        public DbSet<Wishlist> Wishlist { get; set; }

        public DbSet<Reviews> Reviews { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }

        public DbSet<Card> Cards { get; set; }
        public DbSet<Enquiery> Queries { get; set; }

        public DbSet<Cart> CartItems { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{

        //    modelBuilder.Entity<CartItem>().ToTable("cart");
        //}

        // Method for creating object relations
        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    // One category has many services



        //}

    }
}
