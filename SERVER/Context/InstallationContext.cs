using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using ServerDEMOSystem.Models;

namespace ServerDEMOSystem.Context
{
    public class InstallationContext : DbContext
    {
        public InstallationContext(DbContextOptions<InstallationContext> options)
            :base(options) { }
        public InstallationContext(){ }
        public DbSet<Installation> installations { get; set; }
        public DbSet<User> users { get; set; }
        public DbSet<ContactInstall> contactsinstall { get; set; }
        public DbSet<Photo> photos { get; set; }
        public DbSet<ItemsInInstall> itemsininstall {get; set;}
        public DbSet<DownloadedItems> downloadeditems {get; set;}

    }
}