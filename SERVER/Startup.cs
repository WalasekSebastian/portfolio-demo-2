using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.IO;
using ServerDEMOSystem.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ServerDEMOSystem
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json");

            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("alelalamanochala"))
                    };
                });
            services.AddDbContext<UsersContext>(options => options
            .UseMySql(
                Configuration.GetConnectionString("DefaultConnection"),
                new MariaDbServerVersion(new Version(10, 5, 9)),
                        mySqlOptions => mySqlOptions
                            .CharSetBehavior(CharSetBehavior.NeverAppend)
                ));
            services.AddDbContext<LoginContext>(options => options
            .UseMySql(
                Configuration.GetConnectionString("DefaultConnection"),
                new MariaDbServerVersion(new Version(10, 5, 9)),
                        mySqlOptions => mySqlOptions
                            .CharSetBehavior(CharSetBehavior.NeverAppend)
                ));

            services.AddDbContext<InstallationContext>(options => options
            .UseMySql(
                Configuration.GetConnectionString("DefaultConnection"),
                new MariaDbServerVersion(new Version(10, 5, 9)),
                        mySqlOptions => mySqlOptions
                            .CharSetBehavior(CharSetBehavior.NeverAppend)
                ));

            services.AddDbContext<RejWorkContext>(options => options
            .UseMySql(
                Configuration.GetConnectionString("DefaultConnection"),
                new MariaDbServerVersion(new Version(10, 5, 9)),
                        mySqlOptions => mySqlOptions
                            .CharSetBehavior(CharSetBehavior.NeverAppend)
                ));

            services.AddDbContext<SettingsContext>(options => options
                        .UseMySql(
                            Configuration.GetConnectionString("DefaultConnection"),
                            new MariaDbServerVersion(new Version(10, 5, 9)),
                                    mySqlOptions => mySqlOptions
                                        .CharSetBehavior(CharSetBehavior.NeverAppend)
                ));

            services.AddDbContext<OrdersContext>(options => options
                        .UseMySql(
                            Configuration.GetConnectionString("DefaultConnection"),
                            new MariaDbServerVersion(new Version(10, 5, 9)),
                                    mySqlOptions => mySqlOptions
                                        .CharSetBehavior(CharSetBehavior.NeverAppend)
                ));

            services.AddCors(options =>
                {
                    options.AddPolicy("CorsPolicy",
                        builder =>
                                  {
                                      builder
                                      .SetIsOriginAllowed(origin => true)
                                                        .AllowAnyMethod()
                                                        .AllowAnyHeader()
                                                        .AllowCredentials()
                                                        .Build();
                                  });
                });

            services.AddControllers();
            services.AddControllers().AddNewtonsoftJson();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("CorsPolicy");
            app.UseAuthentication();

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

        }
    }
}
