using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using ServerDEMOSystem.Models;

namespace ServerDEMOSystem.Context
{
    public class OrdersContext : DbContext
    {
        public OrdersContext(DbContextOptions<OrdersContext> options)
            :base(options) { }
        public OrdersContext(){ }
        public DbSet<Order> orders { get; set; }
        public DbSet<User> users { get; set; }
        public DbSet<Installation> installations { get; set; }
        public DbSet<Status> statuses { get; set; }
        public DbSet<PriorityStatus> prioritystatus { get; set; }
        public DbSet<ItemsOrder> itemsorder { get; set; }
        public DbSet<Unit> units { get; set; }

        public DbSet<ItemsInInstall> itemsininstall {get; set;}
        public DbSet<DownloadedItems> downloadeditems {get; set;}
        public DbSet<Settings> settings { get; set; }

    }
}