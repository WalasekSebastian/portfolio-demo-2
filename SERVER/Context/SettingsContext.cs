using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using ServerDEMOSystem.Models;

namespace ServerDEMOSystem.Context
{
    public class SettingsContext : DbContext
    {
        public SettingsContext(DbContextOptions<SettingsContext> options)
            :base(options) { }
        public SettingsContext(){ }
        public DbSet<Unit> units { get; set; }
        public DbSet<User> users { get; set; }
        public DbSet<Installation> installations { get; set; }
        public DbSet<Settings> settings { get; set; }
    }
}