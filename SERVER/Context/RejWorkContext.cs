using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using ServerDEMOSystem.Models;

namespace ServerDEMOSystem.Context
{
    public class RejWorkContext : DbContext
    {
        public RejWorkContext(DbContextOptions<RejWorkContext> options)
            :base(options) { }
        public RejWorkContext(){ }
        public DbSet<RejWork> rejworks { get; set; }
        public DbSet<RateWork> rateworks { get; set; }
        public DbSet<User> users { get; set; }
        public DbSet<Installation> installations { get; set; }
        public DbSet<Settings> settings { get; set; }
        public DbSet<Bonus> bonuses { get; set; }

    }
}