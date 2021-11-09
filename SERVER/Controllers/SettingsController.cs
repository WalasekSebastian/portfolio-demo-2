using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ServerDEMOSystem.Models;
using ServerDEMOSystem.Context;
using System.Linq;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.IO;

namespace ServerDEMOSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class SettingsController : Controller
    {
        private IConfiguration _config;
        private readonly SettingsContext _context;

        public SettingsController(IConfiguration config, SettingsContext context)
        {
            _config = config;
            _context = context;
        }

        /// <summary>
        /// List of units
        /// </summary>
        /// <returns>List of units</returns>
        [HttpGet("allunits")]
        public IActionResult GetAllUnits()
        {
            try
            {
                List<Unit> units = _context.units.ToList();
                return Ok(units);
            }
            catch
            {
                return NoContent();
            }
        }

        /// <summary>
        /// Add new unit, only admin and kierownik has permmisions to add new unit
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="unit">Unit to add</param>
        /// <returns>Status ok when unit is succesfull added, 'exist' when unit is exist, 'notAdmin' when user has't permissions</returns>
        [HttpPost("new")]
        public async Task<IActionResult> CreateNewUnit([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] Unit unit)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin >= 8).Single();
                if (admin != null)
                {
                    Unit un = _context.units.Where(u => u.Name == unit.Name || u.ShortName == unit.ShortName).FirstOrDefault();
                    if (un == null)
                    {
                        _context.Add(unit);
                        await _context.SaveChangesAsync();
                        var status = "ok";
                        return Ok(new { status });
                    }
                    else
                    {
                        var response = "exist";
                        return BadRequest(response);
                    }
                }
                else
                    return BadRequest("notAdmin");
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Update unit, only admin and kierownik has permmisions to update unit
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="unit">Unit to update</param>
        /// <returns>Status ok when unit is succesfull update, 'notAdmin' when user has't permissions</returns>
        [HttpPut("unitUpdate")]
        public async Task<IActionResult> UpdateUnit([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] Unit unit)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin >= 8).Single();
                if (admin != null)
                {
                    _context.Update(unit);
                    await _context.SaveChangesAsync();
                    var status = "ok";
                    return Ok(new { status });
                }
                else
                    return BadRequest("notAdmin");
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Functions return instalaltion is set to alternative, only admin has permission to get this data
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <returns>Installation where is set alternative, 'notAdmin' when user has't permission</returns>
        [HttpGet("currentAltenative")]
        public IActionResult CurrentAlternative([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin == 10).Single();
                if (admin != null)
                {
                    Settings settings = _context.settings.Where(s => s.Name == "alternative").FirstOrDefault();
                    Installation installation = _context.installations.Where(i => i.Id == settings.InstallId).FirstOrDefault();
                    return Ok(installation);
                }
                else
                    return BadRequest("notAdmin");
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Functions chenge currrent alternative Installtion, only admin has permission to set this data
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="install">New alternative Installtion</param>
        /// <returns>Ok when succesfull chenged, 'notAdmin' when user has't permission</returns>
        [HttpPut("changeAlternative")]
        public IActionResult ChangeAlternative([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] Installation install)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin == 10).Single();
                if (admin != null)
                {
                    Settings settings = _context.settings.Where(s => s.Name == "alternative").FirstOrDefault();
                    settings.InstallId = install.Id;
                    _context.Update(settings);
                    _context.SaveChanges();
                    return Ok();
                }
                else
                    return BadRequest("notAdmin");
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Functions return instalaltion is set to warehouse, only admin has permission to get this data
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <returns>Installation where is set warehouse, 'notAdmin' when user has't permission</returns>
        [HttpGet("currentWarehouse")]
        public IActionResult CurrentWarehouse([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin == 10).Single();
                if (admin != null)
                {
                    Settings settings = _context.settings.Where(s => s.Name == "warehouse").FirstOrDefault();
                    Installation installation = _context.installations.Where(i => i.Id == settings.InstallId).FirstOrDefault();
                    return Ok(installation);
                }
                else
                    return BadRequest("notAdmin");
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Functions chenge currrent warehouse Installtion, only admin has permission to set this data
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="install">New warehouse Installtion</param>
        /// <returns>Ok when succesfull chenged, 'notAdmin' when user has't permission</returns>
        [HttpPut("changeWarehouse")]
        public IActionResult ChangeWarehouse([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] Installation install)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin == 10).Single();
                if (admin != null)
                {
                    Settings settings = _context.settings.Where(s => s.Name == "warehouse").FirstOrDefault();
                    settings.InstallId = install.Id;
                    _context.Update(settings);
                    _context.SaveChanges();
                    return Ok();
                }
                else
                    return BadRequest("notAdmin");
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// HDD space available, only admin has permission to read this data
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <returns>info about HDD space available, 'notAdmin' when user has't permission to read this data</returns>
        [HttpGet("checkHddInfo")]
        public IActionResult CheckHddInfo([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin == 10).Single();
                if (admin != null)
                {
                    double bytesGB =  0.000000000931;
                    DriveInfo[] allDrives = DriveInfo.GetDrives();

                    List<HDDInfo> hDDInfos = new List<HDDInfo>();

                    foreach (DriveInfo d in allDrives)
                    {
                        HDDInfo hDDInfo = new HDDInfo();
                        if (d.IsReady == true)
                        {
                            // in linux system this '/' is main HDD, soo returns only this data
                            if (d.Name.Equals("/"))
                            {
                                hDDInfo.Name = d.Name;
                                hDDInfo.FreeSpace = Math.Round((d.AvailableFreeSpace * bytesGB), 2);
                                hDDInfo.TotalSpace = Math.Round((d.TotalSize * bytesGB), 2);
                                hDDInfo.PerTotalSpace = 100;
                                hDDInfo.PerFreeSpace = Math.Round(((100 * hDDInfo.FreeSpace) / hDDInfo.TotalSpace), 2);
                                hDDInfo.NotAvaiable = Math.Round((hDDInfo.TotalSpace - hDDInfo.FreeSpace), 2);
                                hDDInfo.PerNotAvaiable = Math.Round(((100 * hDDInfo.NotAvaiable) / hDDInfo.TotalSpace), 2);
                                hDDInfos.Add(hDDInfo);;
                            }
                        }
                    }
                    return Ok(hDDInfos);
                }
                else
                    return BadRequest("notAdmin");
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}