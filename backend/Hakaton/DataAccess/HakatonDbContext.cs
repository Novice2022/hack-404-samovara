using Hakaton.Models;
using Microsoft.EntityFrameworkCore;

namespace Hakaton.DataAccess
{
    public class HakatonDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<Response> Responses { get; set; }

        private readonly IConfiguration _configuration;

        public HakatonDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_configuration.GetConnectionString("DefaultConnection"));
        }
    }
}
