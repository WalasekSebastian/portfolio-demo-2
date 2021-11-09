using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using ServerDEMOSystem.Models;

namespace ServerDEMOSystem.Context
{
    public class LoginContext : DbContext
    {
        public LoginContext(DbContextOptions<LoginContext> options)
            :base(options) { }
        public LoginContext(){ }
        public DbSet<User> users { get; set; }
    }
}