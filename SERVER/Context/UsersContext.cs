using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using ServerDEMOSystem.Models;

namespace ServerDEMOSystem.Context
{
    public class UsersContext : DbContext
    {
        public UsersContext(DbContextOptions<UsersContext> options)
            :base(options) { }
        public UsersContext(){ }
        public DbSet<RateWork> rateworks { get; set; }
        public DbSet<User> users { get; set; }
        
    }
}