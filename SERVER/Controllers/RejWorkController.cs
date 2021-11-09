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

namespace ServerDEMOSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class RejWorkController : Controller
    {
        private IConfiguration _config;
        private readonly RejWorkContext _context;

        public RejWorkController(IConfiguration config, RejWorkContext context)
        {
            _config = config;
            _context = context;
        }

        [HttpGet("all")]
        public IActionResult GetAllRejWork([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    List<RejWork> rejWorksAll = _context.rejworks.ToList();
                    return Ok(rejWorksAll);
                }
                else
                    return BadRequest("notAdmin");
            }
            catch
            {
                return NoContent();
            }
        }


        /// <summary>
        /// Add work from Mobile
        /// </summary>
        /// <param name="login"></param>
        /// <param name="token"></param>
        /// <param name="rejWork"></param>
        /// <returns></returns>
        [HttpPost("new")]
        public async Task<IActionResult> CreateNewRejWork([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] RejWork rejWork)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    rejWork.UserId = user.Id;
                    if (CheckWorkDuplicate(rejWork))
                    {
                        // set secundes to 0
                        DateTime sd = new DateTime();
                        sd = sd.AddYears(rejWork.DateStart.Year - 1).AddMonths(rejWork.DateStart.Month - 1).AddDays(rejWork.DateStart.Day - 1).AddHours(rejWork.DateStart.Hour).AddMinutes(rejWork.DateStart.Minute);
                        rejWork.DateStart = sd;

                        DateTime ed = new DateTime();
                        ed = ed.AddYears(rejWork.DateEnd.Year - 1).AddMonths(rejWork.DateEnd.Month - 1).AddDays(rejWork.DateEnd.Day - 1).AddHours(rejWork.DateEnd.Hour).AddMinutes(rejWork.DateEnd.Minute);
                        rejWork.DateEnd = ed;

                        _context.Add(rejWork);
                        await _context.SaveChangesAsync();
                        var status = "ok";
                        return Ok(new { status });
                    }
                    else
                        return BadRequest(error: "exist");
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Add work from WEB if admin
        /// </summary>
        /// <param name="login"></param>
        /// <param name="token"></param>
        /// <param name="rejWork"></param>
        /// <returns></returns>
        [HttpPost("add")]
        public async Task<IActionResult> CreateNewRejWorkFromWeb([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] RejWork rejWork)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin == 10).Single();
                if (admin != null)
                {
                    if (CheckWorkDuplicate(rejWork))
                    {
                        _context.Add(rejWork);
                        await _context.SaveChangesAsync();
                        var status = "ok";
                        return Ok(new { status });
                    }
                    else
                        return BadRequest(error: "exist");
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Edit work from WEB
        /// </summary>
        /// <param name="login"></param>
        /// <param name="token"></param>
        /// <param name="rejWork"></param>
        /// <returns></returns>
        [HttpPost("edit")]
        public async Task<IActionResult> EditRejWorkFromWeb([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] RejWork rejWork)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin == 10).Single();
                if (admin != null)
                {
                    if (CheckWorkDuplicate(rejWork))
                    {
                        _context.Update(rejWork);
                        await _context.SaveChangesAsync();
                        var status = "ok";
                        return Ok(new { status });
                    }
                    else
                        return BadRequest(error: "exist");
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Remove pernament work (from WEB)
        /// </summary>
        /// <param name="login"></param>
        /// <param name="token"></param>
        /// <param name="rejWork"></param>
        /// <returns></returns>
        [HttpPut("removeWork")]
        public async Task<IActionResult> DeleteRejWorkFromWeb([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] RejWork rejWork)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin == 10).Single();
                if (admin != null)
                {
                    _context.Remove(rejWork);
                    await _context.SaveChangesAsync();
                    var status = "ok";
                    return Ok(new { status });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return BadRequest();
            }
        }


        /// <summary>
        /// Update work from mobile
        /// </summary>
        /// <param name="login"></param>
        /// <param name="token"></param>
        /// <param name="rejWork"></param>
        /// <returns></returns>
        [HttpPut("update")]
        public async Task<IActionResult> UpdateRejWork([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] RejWork rejWork)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    RejWork rj = _context.rejworks.AsNoTracking().Where(r => r.Id == rejWork.Id && r.UserId == user.Id).FirstOrDefault();
                    if (rj != null)
                    {
                        rejWork.UserId = user.Id;

                        if (CheckWorkDuplicate(rejWork))
                        {
                            // set secundes to 0
                            DateTime sd = new DateTime();
                            sd = sd.AddYears(rejWork.DateStart.Year - 1).AddMonths(rejWork.DateStart.Month - 1).AddDays(rejWork.DateStart.Day - 1).AddHours(rejWork.DateStart.Hour).AddMinutes(rejWork.DateStart.Minute);
                            rejWork.DateStart = sd;

                            DateTime ed = new DateTime();
                            ed = ed.AddYears(rejWork.DateEnd.Year - 1).AddMonths(rejWork.DateEnd.Month - 1).AddDays(rejWork.DateEnd.Day - 1).AddHours(rejWork.DateEnd.Hour).AddMinutes(rejWork.DateEnd.Minute);
                            rejWork.DateEnd = ed;

                            _context.Update(rejWork);
                            await _context.SaveChangesAsync();
                            var status = "ok";
                            return Ok(new { status });
                        }
                        else
                            return BadRequest(error: "exist");
                    }
                    else
                    {
                        return BadRequest();
                    }
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Get all works user - only for Admin
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="user">User to get works</param>
        /// <returns>User works</returns>
        [HttpPost("allUser")]
        public IActionResult GetAllRejWorkUser([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] User user)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    List<RejWork> rejWorksAll = _context.rejworks.Where(r => r.UserId == user.Id).ToList();
                    return Ok(rejWorksAll);
                }
                else
                    return BadRequest("notAdmin");
            }
            catch
            {
                return NoContent();
            }
        }

        /// <summary>
        /// Get user work from date
        /// Function used in mobile praca -> histria pracy -> zakres dat
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="userDetail"></param>
        /// <returns>Works user</returns>
        [HttpPost("userHistoryMobileDate")]
        public IActionResult DateAllRejWorkUserMobile([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] UserDetail userDetail)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    DateTime df = new DateTime();
                    df = df.AddYears(userDetail.DateFrom.Year - 1).AddMonths(userDetail.DateFrom.Month - 1).AddDays(userDetail.DateFrom.Day - 1);

                    DateTime dt = new DateTime();
                    dt = dt.AddYears(userDetail.DateTo.Year - 1).AddMonths(userDetail.DateTo.Month - 1).AddDays(userDetail.DateTo.Day - 1);

                    List<RejWork> rejWorkList = _context.rejworks.Where(r => r.UserId == user.Id && r.DateStart >= df && r.DateStart <= dt.AddDays(1)).ToList();
                    List<Installation> installations = _context.installations.ToList();
                    var data = rejWorkList.AsQueryable().Join(
                        installations,
                        rej => rej.InstallationId,
                        inst => inst.Id,
                        (rej, inst) => new
                        {
                            id = rej.Id,
                            name = inst.Name,
                            date = rej.DateStart,
                            timeStart = rej.DateStart.ToString("HH:mm"),
                            timeEnd = rej.DateEnd.ToString("HH:mm"),
                            timeDuration = (rej.DateEnd - rej.DateStart).ToString(@"hh\:mm"),
                            td = (rej.DateEnd - rej.DateStart).TotalHours
                        }
                    ).OrderByDescending(d => d.date);
                    return Ok(data);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return NoContent();
            }
        }

        /// <summary>
        /// Get last 30 works for user - used in Mobile
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <returns>Last 30 user works</returns>
        [HttpPost("userHistoryMobile")]
        public IActionResult GetLast30WorkUserMobile([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    // count all user works
                    int rejTemp = _context.rejworks.Where(r => r.UserId == user.Id).ToList().Count();
                    // sort by date and get last 30 works
                    List<RejWork> rejWorksAll = _context.rejworks.OrderBy(d => d.DateStart).Where(r => r.UserId == user.Id).Skip(Math.Max(0, rejTemp - 30)).ToList();
                    List<Installation> installations = _context.installations.ToList();
                    var data = rejWorksAll.AsQueryable().Join(
                        installations,
                        rej => rej.InstallationId,
                        inst => inst.Id,
                        (rej, inst) => new
                        {
                            id = rej.Id,
                            name = inst.Name,
                            date = rej.DateStart,
                            timeStart = rej.DateStart.ToString("HH:mm"),
                            timeEnd = rej.DateEnd.ToString("HH:mm"),
                            timeDuration = (rej.DateEnd - rej.DateStart).ToString(@"hh\:mm"),
                            td = (rej.DateEnd - rej.DateStart).TotalHours
                        }
                    ).OrderByDescending(d => d.date);
                    return Ok(data);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return NoContent();
            }
        }

        /// <summary>
        /// Get one work user
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="rejWork">Work to get</param>
        /// <returns>RejWork</returns>
        [HttpPost("userWork")]
        public IActionResult UserWork([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] RejWork rejWork)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    RejWork rj = _context.rejworks.AsNoTracking().Where(r => r.Id == rejWork.Id && r.UserId == user.Id).FirstOrDefault();
                    if (rj != null)
                    {
                        return Ok(rj);
                    }
                    else
                    {
                        return BadRequest();
                    }
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return BadRequest();
            }
        }


        /// <summary>
        /// Get one work user where ID
        /// </summary>
        /// <param name="login">User login</param>
        /// <param name="token">User token</param>
        /// <param name="rejWorkId">Id RejWork</param>
        /// <returns>Returns work where id_work</returns>
        [HttpPost("work")]
        public IActionResult Work([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromForm] int rejWorkId)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin == 10).Single();
                if (admin != null)
                {
                    RejWork rej = _context.rejworks.AsNoTracking().Where(r => r.Id == rejWorkId).FirstOrDefault();
                    if (rej != null)
                    {
                        UsersSimply us = new UsersSimply();
                        User u = _context.users.Where(u => u.Id == rej.UserId).FirstOrDefault();
                        us.UserId = u.Id;
                        if ((u.FirstName == null) || (u.LastName == null))
                        {
                            us.Name = u.Login;
                        }
                        else
                        {
                            us.Name = u.FirstName + " " + u.LastName;
                        }
                        var data = new
                        {
                            id = rej.Id,
                            install = _context.installations.Where(i => i.Id == rej.InstallationId).FirstOrDefault(),
                            user = us,
                            timeStart = rej.DateStart.ToString("HH:mm"),
                            dateStart = rej.DateStart.ToString("dd.MM.yyyy"),
                            timeEnd = rej.DateEnd.ToString("HH:mm"),
                            dateEnd = rej.DateEnd.ToString("dd.MM.yyyy"),
                            timeTravel = rej.TimeTravel,
                            description = rej.Description

                        };
                        return Ok(data);
                    }
                    else
                    {
                        return BadRequest();
                    }
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Get detailed work - only for admin and kierownik
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="userDetail">Detail to get works</param>
        /// <returns>Datailed work</returns>
        [HttpPost("userDetailWorks")]
        public IActionResult UserDetailWorks([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] UserDetail userDetail)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin >= 8 && u.Active == 1).Single();
                if (admin != null)
                {
                    List<RejWork> rejWorkList = _context.rejworks.Where(r => r.UserId == userDetail.UserId && r.DateStart >= userDetail.DateFrom && r.DateStart <= userDetail.DateTo.AddDays(1)).ToList();
                    List<Installation> installations = _context.installations.ToList();
                    User us = _context.users.Where(u => u.Id == userDetail.UserId).FirstOrDefault();
                    var data = rejWorkList.AsQueryable().Join(
                        installations,
                        rej => rej.InstallationId,
                        inst => inst.Id,
                        (rej, inst) => new
                        {
                            id = rej.Id,
                            name = us.FirstName + " " + us.LastName,
                            date = rej.DateStart.ToString("dd-MM-yyyy"),
                            installName = inst.Name,
                            timeWork = rej.DateStart.ToString("HH:mm") + "-" + rej.DateEnd.ToString("HH:mm"),
                            timeDuration = (rej.DateEnd - rej.DateStart).ToString(@"hh\:mm"),
                            td = (rej.DateEnd - rej.DateStart).TotalHours,
                            timeTravel = rej.TimeTravel.ToString(@"hh\:mm"),
                            desc = rej.Description
                        }
                    ).OrderByDescending(d => d.date);
                    return Ok(data);
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
        /// Get detailed work from date - only for admin
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="userDetail">Detail to get works</param>
        /// <returns>Datailed work</returns>
        [HttpPost("userDetailWorksAdmin")]
        public IActionResult UserDetailWorksAdmin([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] UserDetail userDetail)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin >= 8 && u.Active == 1).Single();
                if (admin != null)
                {
                    List<RejWork> rejWorkList = _context.rejworks.Where(r => r.UserId == userDetail.UserId && r.DateStart >= userDetail.DateFrom && r.DateStart <= userDetail.DateTo.AddDays(1)).ToList();
                    List<Installation> installations = _context.installations.ToList();
                    User us = _context.users.Where(u => u.Id == userDetail.UserId).FirstOrDefault();
                    List<Bonus> bonus = _context.bonuses.Where(b => b.UserId == userDetail.UserId).ToList();
                    var data = rejWorkList.AsQueryable().Join(
                        installations,
                        rej => rej.InstallationId,
                        inst => inst.Id,
                        (rej, inst) => new
                        {
                            id = rej.Id,
                            name = us.FirstName + " " + us.LastName,
                            date = rej.DateStart.ToString("dd-MM-yyyy"),
                            installName = inst.Name,
                            timeWork = rej.DateStart.ToString("HH:mm") + "-" + rej.DateEnd.ToString("HH:mm"),
                            timeDuration = (rej.DateEnd - rej.DateStart).ToString(@"hh\:mm"),
                            td = (rej.DateEnd - rej.DateStart).TotalHours,
                            timeTravel = rej.TimeTravel.ToString(@"hh\:mm"),
                            desc = rej.Description
                        }
                    ).GroupJoin(
                        bonus,
                        rej => rej.id,
                        bon => bon.RejWorkId,
                        (rej, bon) => new
                        {
                            id = rej.id,
                            name = rej.name,
                            date = rej.date,
                            installName = rej.installName,
                            timeWork = rej.timeWork,
                            timeDuration = rej.timeDuration,
                            td = rej.td,
                            timeTravel = rej.timeTravel,
                            desc = rej.desc,
                            bonus = bon.Select(b => b.Value).SingleOrDefault(),
                            bonDesc = bon.Select(b => b.Description).SingleOrDefault()
                        }
                    ).OrderByDescending(d => d.date);
                    return Ok(data);
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
        /// Get all works from Installation - only for admin and kierownik
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="id">Installation Id</param>
        /// <returns>All works from Installation</returns>
        [HttpGet("worksininstall/{id}")]
        public IActionResult GetAllWorksInInstall([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, int id)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin >= 8 && u.Active == 1).Single();
                if (admin != null)
                {
                    List<RejWork> rejWorkList = _context.rejworks.Where(r => r.InstallationId == id).ToList();
                    Installation installations = _context.installations.Where(i => i.Id == id).FirstOrDefault();
                    List<User> us = _context.users.ToList();
                    var data = rejWorkList.AsQueryable().Join(
                        us,
                        rej => rej.UserId,
                        us => us.Id,
                        (rej, us) => new
                        {
                            id = rej.Id,
                            name = us.FirstName + " " + us.LastName,
                            date = rej.DateStart.ToString("dd-MM-yyyy"),
                            installName = installations.Name,
                            timeWork = rej.DateStart.ToString("HH:mm") + "-" + rej.DateEnd.ToString("HH:mm"),
                            timeDuration = (rej.DateEnd - rej.DateStart).ToString(@"hh\:mm"),
                            td = (rej.DateEnd - rej.DateStart).TotalHours,
                            timeTravel = rej.TimeTravel.ToString(@"hh\:mm"),
                            desc = rej.Description
                        }
                    ).OrderByDescending(d => d.date);
                    return Ok(data);
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
        /// Get datiled work for install from date - only for admin and kierownik
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="body">Install id, and dates from-to</param>
        /// <returns>List of works</returns>
        [HttpPost("installDetailWorks")]
        public IActionResult InstallDetailWorks([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] InstallDetail body)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin >= 8 && u.Active == 1).Single();
                if (admin != null)
                {
                    List<RejWork> rejWorkList = _context.rejworks.Where(r => r.InstallationId == body.InstallId && r.DateStart >= body.DateFrom && r.DateStart <= body.DateTo.AddDays(1)).ToList();
                    Installation installations = _context.installations.Where(i => i.Id == body.InstallId).FirstOrDefault();
                    List<User> us = _context.users.ToList();
                    var data = rejWorkList.AsQueryable().Join(
                        us,
                        rej => rej.UserId,
                        us => us.Id,
                        (rej, us) => new
                        {
                            id = rej.Id,
                            name = us.FirstName + " " + us.LastName,
                            date = rej.DateStart.ToString("dd-MM-yyyy"),
                            installName = installations.Name,
                            timeWork = rej.DateStart.ToString("HH:mm") + "-" + rej.DateEnd.ToString("HH:mm"),
                            timeDuration = (rej.DateEnd - rej.DateStart).ToString(@"hh\:mm"),
                            td = (rej.DateEnd - rej.DateStart).TotalHours,
                            timeTravel = rej.TimeTravel.ToString(@"hh\:mm"),
                            desc = rej.Description
                        }
                    ).OrderByDescending(d => d.date);
                    return Ok(data);
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
        /// Get last 30 works from all works - only for admin and kierownik
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <returns>List 30 last works</returns>
        [HttpGet("lastUsersWorks")]
        public IActionResult LastUsersWorks([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin >= 8 && u.Active == 1).Single();
                if (admin != null)
                {
                    // get last 30 works
                    List<RejWork> rejWorkList = _context.rejworks.OrderBy(o => o.DateStart).Skip(Math.Max(0, _context.rejworks.Count() - 30)).ToList();
                    List<Installation> installations = _context.installations.ToList();
                    List<User> users = _context.users.ToList();
                    var data = rejWorkList.AsQueryable().Join(
                        installations,
                        rej => rej.InstallationId,
                        inst => inst.Id,
                        (rej, inst) => new
                        {
                            id = rej.Id,
                            name = rej.UserId,
                            date = rej.DateStart.ToString("dd-MM-yyyy"),
                            dateToSort = rej.DateStart,
                            installName = inst.Name,
                            timeWork = rej.DateStart.ToString("HH:mm") + "-" + rej.DateEnd.ToString("HH:mm"),
                            timeDuration = (rej.DateEnd - rej.DateStart).TotalHours,
                            timeTravel = rej.TimeTravel.ToString(@"hh\:mm")
                        }
                    ).Join(
                        users,
                        rej => rej.name,
                        usr => usr.Id,
                        (rej, usr) => new
                        {
                            id = rej.id,
                            name = usr.FirstName + " " + usr.LastName,
                            date = rej.date,
                            dateToSort = rej.dateToSort,
                            installName = rej.installName,
                            timeWork = rej.timeWork,
                            timeDuration = rej.timeDuration,
                            timeTravel = rej.timeTravel
                        }
                    )
                    .OrderByDescending(d => d.dateToSort);
                    return Ok(data);
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
        /// Get summory of user from date from-to - only for Admin
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="userDetail">User id and dates to get sumamry</param>
        /// <returns>Sumamry of works</returns>
        [HttpPost("userWorksSummary")]
        public IActionResult UserWorksSummary([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] UserDetail userDetail)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    List<RejWork> rejWorkList = _context.rejworks.Where(r => r.UserId == userDetail.UserId && r.DateStart >= userDetail.DateFrom && r.DateStart <= userDetail.DateTo.AddDays(1)).ToList();
                    User us = _context.users.Where(u => u.Id == userDetail.UserId).FirstOrDefault();
                    RateWork rateWork = _context.rateworks.Where(w => w.UserId == userDetail.UserId).FirstOrDefault();
                    Settings settings = _context.settings.Where(s => s.Name == "alternative").FirstOrDefault();
                    UsersSummary summary = new UsersSummary();
                    List<Bonus> bonuses = _context.bonuses.Where(b => b.UserId == us.Id).ToList();
                    foreach (var x in rejWorkList)
                    {
                        // check works duration is max 24h, if true igonre work
                        var duration = x.DateEnd - x.DateStart;
                        if (duration.TotalHours < 24 && duration.TotalHours > 0)
                        {
                            // check work install is not 'alternative' install
                            if (x.InstallationId != settings.InstallId)
                            {
                                // check day of work is free day
                                if (x.DateStart.DayOfWeek == DayOfWeek.Saturday || x.DateStart.DayOfWeek == DayOfWeek.Sunday)
                                {
                                    // check work duration is more 8h, if true work is overtime
                                    if (duration.TotalHours > 8 && duration.TotalMinutes >= 0)
                                    {
                                        var overtime = duration.Subtract(TimeSpan.FromHours(8));
                                        summary.OvertimeStdHouersHolidays += (int)(overtime.TotalMinutes / 60);
                                        summary.OvertimeStdMinutesHolidays += (int)(overtime.TotalMinutes % 60);
                                        summary.StdHouersHolidays += ((int)(duration.TotalMinutes / 60)) - summary.OvertimeStdHouersHolidays;
                                        summary.StdMinutesHolidays += ((int)(duration.TotalMinutes % 60)) - summary.OvertimeStdMinutesHolidays;
                                    }
                                    else
                                    {
                                        summary.StdHouersHolidays += (int)(duration.TotalMinutes / 60);
                                        summary.StdMinutesHolidays += (int)(duration.TotalMinutes % 60);
                                    }
                                }
                                else
                                {
                                    // check work duration is more 8h, if true work is overtime
                                    if (duration.TotalHours > 8 && duration.TotalMinutes >= 0)
                                    {
                                        var overtime = duration.Subtract(TimeSpan.FromHours(8));
                                        summary.OvertimeStdHouers += (int)(overtime.TotalMinutes / 60);
                                        summary.OvertimeStdMinutes += (int)(overtime.TotalMinutes % 60);
                                        summary.StdHouers += ((int)(duration.TotalMinutes / 60)) - summary.OvertimeStdHouers;
                                        summary.StdMinutes += ((int)(duration.TotalMinutes % 60)) - summary.OvertimeStdMinutes;
                                    }
                                    else
                                    {
                                        summary.StdHouers += (int)(duration.TotalMinutes / 60);
                                        summary.StdMinutes += (int)(duration.TotalMinutes % 60);
                                    }
                                }
                            }
                            else
                            {
                                // check day of work is free day
                                if (x.DateStart.DayOfWeek == DayOfWeek.Saturday || x.DateStart.DayOfWeek == DayOfWeek.Sunday)
                                {
                                    // check work duration is more 8h, if true work is overtime
                                    if (duration.TotalHours > 8 && duration.TotalMinutes >= 0)
                                    {
                                        var overtime = duration.Subtract(TimeSpan.FromHours(8));
                                        summary.OvertimeAlterHouersHolidays += (int)(overtime.TotalMinutes / 60);
                                        summary.OvertimeAlterMinutesHolidays += (int)(overtime.TotalMinutes % 60);
                                        summary.AlterHouersHolidays += ((int)(duration.TotalMinutes / 60)) - summary.OvertimeAlterHouersHolidays;
                                        summary.AlterMinutesHolidays += ((int)(duration.TotalMinutes % 60)) - summary.OvertimeAlterMinutesHolidays;
                                    }
                                    else
                                    {
                                        summary.AlterHouersHolidays += (int)(duration.TotalMinutes / 60);
                                        summary.AlterMinutesHolidays += (int)(duration.TotalMinutes % 60);
                                    }
                                }
                                else
                                {
                                    // check work duration is more 8h, if true work is overtime
                                    if (duration.TotalHours > 8 && duration.TotalMinutes >= 0)
                                    {
                                        var overtime = duration.Subtract(TimeSpan.FromHours(8));
                                        summary.OvertimeAlterHouers += (int)(overtime.TotalMinutes / 60);
                                        summary.OverimeAlterMinutes += (int)(overtime.TotalMinutes % 60);
                                        summary.AlterHouers += ((int)(duration.TotalMinutes / 60)) - summary.OvertimeAlterHouers;
                                        summary.AlterMinutes += ((int)(duration.TotalMinutes % 60)) - summary.OverimeAlterMinutes;
                                    }
                                    else
                                    {
                                        summary.AlterHouers += (int)(duration.TotalMinutes / 60);
                                        summary.AlterMinutes += (int)(duration.TotalMinutes % 60);
                                    }
                                }
                            }
                        }
                        // check work has bonus
                        Bonus b = bonuses.Where(i => i.RejWorkId == x.Id).FirstOrDefault();
                        if (b != null)
                            summary.sumBonus += b.Value;
                    }

                    // change minutes duration to houres
                    TimeSpan tsh = TimeSpan.FromMinutes(summary.StdMinutesHolidays);
                    int rh = (int)(tsh.TotalMinutes / 60);
                    summary.StdHouersHolidays += rh;
                    summary.StdMinutesHolidays -= (rh * 60);

                    TimeSpan ovrtsh = TimeSpan.FromMinutes(summary.OvertimeAlterMinutesHolidays);
                    int ovrrh = (int)(ovrtsh.TotalMinutes / 60);
                    summary.OvertimeStdHouersHolidays += ovrrh;
                    summary.OvertimeStdMinutesHolidays -= (ovrrh * 60);

                    TimeSpan tsw = TimeSpan.FromMinutes(summary.StdMinutes);
                    int rw = (int)(tsw.TotalMinutes / 60);
                    summary.StdHouers += rw;
                    summary.StdMinutes -= (rw * 60);

                    TimeSpan ovrtsw = TimeSpan.FromMinutes(summary.OvertimeStdMinutes);
                    int ovrrw = (int)(ovrtsw.TotalMinutes / 60);
                    summary.OvertimeStdHouers += ovrrw;
                    summary.OvertimeStdMinutes -= (ovrrw * 60);

                    TimeSpan tsah = TimeSpan.FromMinutes(summary.AlterMinutesHolidays);
                    int ra = (int)(tsah.TotalMinutes / 60);
                    summary.AlterHouersHolidays += ra;
                    summary.AlterMinutesHolidays -= (ra * 60);

                    TimeSpan ovrtsah = TimeSpan.FromMinutes(summary.OvertimeAlterMinutesHolidays);
                    int ovrra = (int)(ovrtsah.TotalMinutes / 60);
                    summary.OvertimeAlterHouersHolidays += ovrra;
                    summary.OvertimeAlterMinutesHolidays -= (ovrra * 60);

                    TimeSpan tsa = TimeSpan.FromMinutes(summary.AlterMinutes);
                    int rah = (int)(tsa.TotalMinutes / 60);
                    summary.AlterHouers += rah;
                    summary.AlterMinutes -= (rah * 60);

                    TimeSpan ovrtsa = TimeSpan.FromMinutes(summary.OverimeAlterMinutes);
                    int ovrrah = (int)(ovrtsa.TotalMinutes / 60);
                    summary.OvertimeAlterHouers += ovrrah;
                    summary.OverimeAlterMinutes -= (ovrrah * 60);

                    // work houres multiplication RateWorks per houers
                    summary.sumStd = Math.Round((summary.StdHouers * rateWork.RateStd) + ((rateWork.RateStd * summary.StdMinutes) / 60), 2);
                    summary.sumStdHoliday = Math.Round((summary.StdHouersHolidays * rateWork.RateStdHoliday) + ((rateWork.RateStdHoliday * summary.StdMinutesHolidays) / 60), 2);

                    summary.sumOvertimeStd = Math.Round((summary.OvertimeStdHouers * rateWork.OvertimeStd) + ((rateWork.OvertimeStd * summary.OvertimeStdMinutes) / 60), 2);
                    summary.sumOvertimeStdHoliday = Math.Round((summary.OvertimeStdHouersHolidays * rateWork.OvertimeStdHoliday) + ((rateWork.OvertimeStdHoliday * summary.OvertimeStdMinutesHolidays) / 60), 2);

                    summary.sumAlter = Math.Round((summary.AlterHouers * rateWork.RateAlter) + ((rateWork.RateAlter * summary.AlterMinutes) / 60), 2);
                    summary.sumAlterHoliday = Math.Round((summary.AlterHouersHolidays * rateWork.RateAlterHoliday) + ((rateWork.RateAlterHoliday * summary.AlterMinutesHolidays) / 60), 2);

                    summary.sumOvertimeAlter = Math.Round((summary.OvertimeAlterHouers * rateWork.OvertimeAlter) + ((rateWork.OvertimeAlter * summary.OverimeAlterMinutes) / 60), 2);
                    summary.sumOvertimeAlterHoliday = Math.Round((summary.OvertimeAlterHouersHolidays * rateWork.OvertimeAlterHoliday) + ((rateWork.OvertimeAlterHoliday * summary.OvertimeAlterMinutesHolidays) / 60), 2);

                    summary.sumAll = Math.Round((summary.sumStd + summary.sumStdHoliday + summary.sumAlter + summary.sumAlterHoliday + summary.sumOvertimeStd + summary.sumOvertimeStdHoliday + summary.sumOvertimeAlter + summary.sumOvertimeAlterHoliday + summary.sumBonus), 2);

                    return Ok(summary);
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
        /// Get summary of user works where date - only for user in Mobile
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="userDetail">User id, dates from-to</param>
        /// <returns>user work summary</returns>
        [HttpPost("userWorksSummaryMobile")]
        public IActionResult UserWorksSummaryMobile([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] UserDetail userDetail)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    DateTime df = new DateTime();
                    df = df.AddYears(userDetail.DateFrom.Year - 1).AddMonths(userDetail.DateFrom.Month - 1).AddDays(userDetail.DateFrom.Day - 1);

                    DateTime dt = new DateTime();
                    dt = dt.AddYears(userDetail.DateTo.Year - 1).AddMonths(userDetail.DateTo.Month - 1).AddDays(userDetail.DateTo.Day - 1);

                    List<RejWork> rejWorkList = _context.rejworks.Where(r => r.UserId == user.Id && r.DateStart >= df && r.DateStart <= dt.AddDays(1)).ToList();
                    RateWork rateWork = _context.rateworks.Where(w => w.UserId == user.Id).FirstOrDefault();
                    Settings settings = _context.settings.Where(s => s.Name == "alternative").FirstOrDefault();
                    UsersSummary summary = new UsersSummary();
                    List<Bonus> bonuses = _context.bonuses.Where(b => b.UserId == user.Id).ToList();
                    foreach (var x in rejWorkList)
                    {
                        // check works duration is max 24h, if true igonre work
                        var duration = x.DateEnd - x.DateStart;
                        if (duration.TotalHours < 24 && duration.TotalHours > 0)
                        {
                            // check work install is not 'alternative' install
                            if (x.InstallationId != settings.InstallId)
                            {
                                // check day of work is free day
                                if (x.DateStart.DayOfWeek == DayOfWeek.Saturday || x.DateStart.DayOfWeek == DayOfWeek.Sunday)
                                {
                                    // check work duration is more 8h, if true work is overtime 
                                    if (duration.TotalHours > 8 && duration.TotalMinutes >= 0)
                                    {
                                        var overtime = duration.Subtract(TimeSpan.FromHours(8));
                                        summary.OvertimeStdHouersHolidays += (int)(overtime.TotalMinutes / 60);
                                        summary.OvertimeStdMinutesHolidays += (int)(overtime.TotalMinutes % 60);
                                        summary.StdHouersHolidays += ((int)(duration.TotalMinutes / 60)) - summary.OvertimeStdHouersHolidays;
                                        summary.StdMinutesHolidays += ((int)(duration.TotalMinutes % 60)) - summary.OvertimeStdMinutesHolidays;
                                    }
                                    else
                                    {
                                        summary.StdHouersHolidays += (int)(duration.TotalMinutes / 60);
                                        summary.StdMinutesHolidays += (int)(duration.TotalMinutes % 60);
                                    }
                                }
                                else
                                {
                                    // check work duration is more 8h, if true work is overtime
                                    if (duration.TotalHours > 8 && duration.TotalMinutes >= 0)
                                    {
                                        var overtime = duration.Subtract(TimeSpan.FromHours(8));
                                        summary.OvertimeStdHouers += (int)(overtime.TotalMinutes / 60);
                                        summary.OvertimeStdMinutes += (int)(overtime.TotalMinutes % 60);
                                        summary.StdHouers += ((int)(duration.TotalMinutes / 60)) - summary.OvertimeStdHouers;
                                        summary.StdMinutes += ((int)(duration.TotalMinutes % 60)) - summary.OvertimeStdMinutes;
                                    }
                                    else
                                    {
                                        summary.StdHouers += (int)(duration.TotalMinutes / 60);
                                        summary.StdMinutes += (int)(duration.TotalMinutes % 60);
                                    }
                                }
                            }
                            else
                            {
                                // check day of work is free day
                                if (x.DateStart.DayOfWeek == DayOfWeek.Saturday || x.DateStart.DayOfWeek == DayOfWeek.Sunday)
                                {
                                    // check work duration is more 8h, if true work is overtime
                                    if (duration.TotalHours > 8 && duration.TotalMinutes >= 0)
                                    {
                                        var overtime = duration.Subtract(TimeSpan.FromHours(8));
                                        summary.OvertimeAlterHouersHolidays += (int)(overtime.TotalMinutes / 60);
                                        summary.OvertimeAlterMinutesHolidays += (int)(overtime.TotalMinutes % 60);
                                        summary.AlterHouersHolidays += ((int)(duration.TotalMinutes / 60)) - summary.OvertimeAlterHouersHolidays;
                                        summary.AlterMinutesHolidays += ((int)(duration.TotalMinutes % 60)) - summary.OvertimeAlterMinutesHolidays;
                                    }
                                    else
                                    {
                                        summary.AlterHouersHolidays += (int)(duration.TotalMinutes / 60);
                                        summary.AlterMinutesHolidays += (int)(duration.TotalMinutes % 60);
                                    }
                                }
                                else
                                {
                                    // check work duration is more 8h, if true work is overtime
                                    if (duration.TotalHours > 8 && duration.TotalMinutes >= 0)
                                    {
                                        var overtime = duration.Subtract(TimeSpan.FromHours(8));
                                        summary.OvertimeAlterHouers += (int)(overtime.TotalMinutes / 60);
                                        summary.OverimeAlterMinutes += (int)(overtime.TotalMinutes % 60);
                                        summary.AlterHouers += ((int)(duration.TotalMinutes / 60)) - summary.OvertimeAlterHouers;
                                        summary.AlterMinutes += ((int)(duration.TotalMinutes % 60)) - summary.OverimeAlterMinutes;
                                    }
                                    else
                                    {
                                        summary.AlterHouers += (int)(duration.TotalMinutes / 60);
                                        summary.AlterMinutes += (int)(duration.TotalMinutes % 60);
                                    }
                                }
                            }
                        }
                        // check work has bonus
                        Bonus b = bonuses.Where(i => i.RejWorkId == x.Id).FirstOrDefault();
                        if (b != null)
                            summary.sumBonus += b.Value;
                    }

                    // change minutes duration to houres
                    TimeSpan tsh = TimeSpan.FromMinutes(summary.StdMinutesHolidays);
                    int rh = (int)(tsh.TotalMinutes / 60);
                    summary.StdHouersHolidays += rh;
                    summary.StdMinutesHolidays -= (rh * 60);

                    TimeSpan ovrtsh = TimeSpan.FromMinutes(summary.OvertimeAlterMinutesHolidays);
                    int ovrrh = (int)(ovrtsh.TotalMinutes / 60);
                    summary.OvertimeStdHouersHolidays += ovrrh;
                    summary.OvertimeStdMinutesHolidays -= (ovrrh * 60);

                    TimeSpan tsw = TimeSpan.FromMinutes(summary.StdMinutes);
                    int rw = (int)(tsw.TotalMinutes / 60);
                    summary.StdHouers += rw;
                    summary.StdMinutes -= (rw * 60);

                    TimeSpan ovrtsw = TimeSpan.FromMinutes(summary.OvertimeStdMinutes);
                    int ovrrw = (int)(ovrtsw.TotalMinutes / 60);
                    summary.OvertimeStdHouers += ovrrw;
                    summary.OvertimeStdMinutes -= (ovrrw * 60);

                    TimeSpan tsah = TimeSpan.FromMinutes(summary.AlterMinutesHolidays);
                    int ra = (int)(tsah.TotalMinutes / 60);
                    summary.AlterHouersHolidays += ra;
                    summary.AlterMinutesHolidays -= (ra * 60);

                    TimeSpan ovrtsah = TimeSpan.FromMinutes(summary.OvertimeAlterMinutesHolidays);
                    int ovrra = (int)(ovrtsah.TotalMinutes / 60);
                    summary.OvertimeAlterHouersHolidays += ovrra;
                    summary.OvertimeAlterMinutesHolidays -= (ovrra * 60);

                    TimeSpan tsa = TimeSpan.FromMinutes(summary.AlterMinutes);
                    int rah = (int)(tsa.TotalMinutes / 60);
                    summary.AlterHouers += rah;
                    summary.AlterMinutes -= (rah * 60);

                    TimeSpan ovrtsa = TimeSpan.FromMinutes(summary.OverimeAlterMinutes);
                    int ovrrah = (int)(ovrtsa.TotalMinutes / 60);
                    summary.OvertimeAlterHouers += ovrrah;
                    summary.OverimeAlterMinutes -= (ovrrah * 60);

                    // work houres multiplication RateWorks per houers
                    summary.sumStd = Math.Round((summary.StdHouers * rateWork.RateStd) + ((rateWork.RateStd * summary.StdMinutes) / 60), 2);
                    summary.sumStdHoliday = Math.Round((summary.StdHouersHolidays * rateWork.RateStdHoliday) + ((rateWork.RateStdHoliday * summary.StdMinutesHolidays) / 60), 2);

                    summary.sumOvertimeStd = Math.Round((summary.OvertimeStdHouers * rateWork.OvertimeStd) + ((rateWork.OvertimeStd * summary.OvertimeStdMinutes) / 60), 2);
                    summary.sumOvertimeStdHoliday = Math.Round((summary.OvertimeStdHouersHolidays * rateWork.OvertimeStdHoliday) + ((rateWork.OvertimeStdHoliday * summary.OvertimeStdMinutesHolidays) / 60), 2);

                    summary.sumAlter = Math.Round((summary.AlterHouers * rateWork.RateAlter) + ((rateWork.RateAlter * summary.AlterMinutes) / 60), 2);
                    summary.sumAlterHoliday = Math.Round((summary.AlterHouersHolidays * rateWork.RateAlterHoliday) + ((rateWork.RateAlterHoliday * summary.AlterMinutesHolidays) / 60), 2);

                    summary.sumOvertimeAlter = Math.Round((summary.OvertimeAlterHouers * rateWork.OvertimeAlter) + ((rateWork.OvertimeAlter * summary.OverimeAlterMinutes) / 60), 2);
                    summary.sumOvertimeAlterHoliday = Math.Round((summary.OvertimeAlterHouersHolidays * rateWork.OvertimeAlterHoliday) + ((rateWork.OvertimeAlterHoliday * summary.OvertimeAlterMinutesHolidays) / 60), 2);

                    summary.sumAll = Math.Round((summary.sumStd + summary.sumStdHoliday + summary.sumAlter + summary.sumAlterHoliday + summary.sumOvertimeStd + summary.sumOvertimeStdHoliday + summary.sumOvertimeAlter + summary.sumOvertimeAlterHoliday + summary.sumBonus), 2);

                    return Ok(summary);
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
        /// Short summary of user works - used in Mobile in dashboard
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <returns>Short sumamry</returns>
        [HttpGet("userWorksSummaryMobile")]
        public IActionResult UserWorksSummaryMobile([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    // get curent month
                    DateTime currentMonth = DateTime.Now;
                    var firstDayOfMonth = new DateTime(currentMonth.Year, currentMonth.Month, 1);
                    var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

                    // get last month
                    DateTime lastMonth = DateTime.Now;
                    var firstDayOfLastMonth = new DateTime(lastMonth.Year, (lastMonth.Month - 1), 1);
                    var lastDayOfLastMonth = firstDayOfLastMonth.AddMonths(1).AddDays(-1);

                    List<RejWork> rejWorkList = _context.rejworks.Where(r => r.UserId == user.Id && r.DateStart >= firstDayOfLastMonth && r.DateStart <= currentMonth.AddDays(1)).ToList();

                    int currentMonthHouers = 0, lastMonthHouers = 0, currentMonthMinutes = 0, lastMonthMinutes = 0;

                    foreach (var x in rejWorkList)
                    {
                        // check works duration is max 24h, if true igonre work
                        var duration = x.DateEnd - x.DateStart;
                        if (duration.TotalHours < 24 && duration.TotalHours > 0)
                        {
                            if (x.DateStart.Month == currentMonth.Month)
                            {
                                currentMonthHouers += (int)(duration.TotalMinutes / 60);
                                currentMonthMinutes += (int)(duration.TotalMinutes % 60);
                            }
                            else
                            {
                                lastMonthHouers += (int)(duration.TotalMinutes / 60);
                                lastMonthMinutes += (int)(duration.TotalMinutes % 60);
                            }
                        }
                    }

                    // change minutes duration to houres
                    TimeSpan tsh = TimeSpan.FromMinutes(currentMonthMinutes);
                    int rh = (int)(tsh.TotalMinutes / 60);
                    currentMonthHouers += rh;
                    currentMonthMinutes -= (rh * 60);

                    TimeSpan tsw = TimeSpan.FromMinutes(lastMonthMinutes);
                    int rw = (int)(tsw.TotalMinutes / 60);
                    lastMonthHouers += rw;
                    lastMonthMinutes -= (rw * 60);

                    UsersSummaryMobile summary = new UsersSummaryMobile();
                    summary.CurrentMonth = firstDayOfMonth.ToString("dd") + "-" + lastDayOfMonth.ToString("dd.MM.yyyy") + ": " + currentMonthHouers.ToString() + "h " + currentMonthMinutes.ToString() + "min";
                    summary.LastMonth = firstDayOfLastMonth.ToString("dd") + "-" + lastDayOfLastMonth.ToString("dd.MM.yyyy") + ": " + lastMonthHouers.ToString() + "h " + lastMonthMinutes.ToString() + "min";

                    return Ok(summary);
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
        /// Add and update user bonus to work - only for Admin
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="body">Bonus params</param>
        /// <returns>Staus of if succesfull added or update</returns>
        [HttpPost("userBonus")]
        public IActionResult UserBonus([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] Bonus body)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    Bonus bonus = _context.bonuses.Where(b => b.RejWorkId == body.RejWorkId && b.UserId == body.UserId).FirstOrDefault();
                    if (bonus == null)
                    {
                        body.DateAdd = DateTime.Now;
                        body.DateModify = DateTime.Now;
                        body.AddUserId = admin.Id;
                        _context.Add(body);
                        _context.SaveChanges();
                        return Ok();
                    }
                    else
                    {
                        bonus.Value = body.Value;
                        bonus.Description = body.Description;
                        bonus.DateModify = DateTime.Now;
                        _context.Update(bonus);
                        _context.SaveChanges();
                        return Ok();
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
        /// Check work exist in selected date
        /// </summary>
        /// <param name="work">work to check</param>
        /// <returns>Returns true if work not exist in date selected</returns>
        private bool CheckWorkDuplicate(RejWork work)
        {
            // ckeck new work start date is beetwen start-end other work
            RejWork rjStart = _context.rejworks
            .Where(r => r.UserId == work.UserId && r.Id != work.Id &&
            (work.DateStart >= r.DateStart && work.DateStart <= r.DateEnd.AddSeconds(-1)))
            .FirstOrDefault();
            if (rjStart == null)
            {
                // ckeck new work end date is beetwen start-end other work
                RejWork rjEnd = _context.rejworks
                .Where(r => r.UserId == work.UserId && r.Id != work.Id &&
                (work.DateEnd >= r.DateStart && work.DateEnd <= r.DateEnd))
                .FirstOrDefault();
                if (rjEnd == null)
                {
                    // ckeck exist work start date is beetwen start-end new work
                    RejWork rjStartEx = _context.rejworks
                    .Where(r => r.UserId == work.UserId && r.Id != work.Id &&
                    (r.DateStart >= work.DateStart && r.DateStart <= work.DateEnd))
                    .FirstOrDefault();
                    if (rjStartEx == null)
                    {
                        // ckeck exist work end date is beetwen start-end new work
                        RejWork rjEndEx = _context.rejworks
                        .Where(r => r.UserId == work.UserId && r.Id != work.Id &&
                        (r.DateEnd >= work.DateStart.AddSeconds(1) && r.DateEnd <= work.DateEnd))
                        .FirstOrDefault();
                        
                        // if true we can't add new work, work in date start-end exist
                        if (rjEndEx == null)
                            return true;
                        else
                            return false;
                    }
                    else
                        return false;
                }
                else
                    return false;
            }
            else
                return false;
        }
    }
}