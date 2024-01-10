using NTUCClub.Models;
using Microsoft.EntityFrameworkCore;
using NTUCClub.Models.Products;

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
        public DbSet<Category> Category { get; set; }
        public DbSet<Reviews> Reviews { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<Query> Queries { get; set; }
        public DbSet<Cart> Cart { get; set; }

        // Method for creating object relations
        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    // One category has many services
        //    modelBuilder.Entity<Service>()
        //        .HasOne(s => s.Category)
        //        .WithMany(c => c.Services)
        //        .HasForeignKey(s => s.CategoryId);

        //    // One service has many reviews
        //    modelBuilder.Entity<Reviews>()
        //        .HasOne(r => r.Service)
        //        .WithMany(s => s.Reviews)
        //        .HasForeignKey(r => r.ServiceId);

        //    // One user has many activity services
        //    modelBuilder.Entity<Service>()
        //        .HasOne(s => s.UserActivity)
        //        .WithMany(ua => ua.Services)
        //        .HasForeignKey(s => s.UserActivityId);
        //}

    }
}
