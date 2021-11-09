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
    public class UsersController : Controller
    {
        private IConfiguration _config;
        private readonly UsersContext _context;

        public UsersController(IConfiguration config, UsersContext context)
        {
            _config = config;
            _context = context;
        }

        /// <summary>
        /// List users, function only for Admin and Kierownik
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="activeOnly">Bool - when we need list only active users</param>
        /// <returns>List users</returns>
        [HttpPost("all")]
        public IActionResult GetAllUsers([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromForm]bool activeOnly)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin >= 8 && u.Active == 1).Single();
                if (admin != null)
                {
                    List<User> _allUser = new List<User>();
                    if(!activeOnly)
                        _allUser = _context.users.Where(u => u.Active == 1).ToList();
                    else
                        _allUser = _context.users.ToList();
                    foreach (var x in _allUser)
                    {
                        // all password set to 'x' - we don't need read this in web
                        x.Password = "x";
                    }
                    return Ok(_allUser);
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
        /// List simply users, function only for Admin and Kierownik
        /// </summary>
        /// <param name="login">usre login</param>
        /// <param name="token">user token</param>
        /// <returns>List users, return only Name (or login) and Id</returns>
        [HttpGet("allUsersSimply")]
        public IActionResult GetAllUsersToWork([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin >= 8 && u.Active == 1).Single();
                if (admin != null)
                {
                    List<User> _allUser = _context.users.ToList();
                    List<UsersSimply> users = new List<UsersSimply>();
                    foreach (var u in _allUser)
                    {
                        UsersSimply us = new UsersSimply();
                        us.UserId = u.Id;
                        if ((u.FirstName == null) || (u.LastName == null))
                        {
                            us.Name = u.Login;
                        }
                        else
                        {
                            us.Name = u.FirstName + " " + u.LastName;
                        }
                        users.Add(us);
                    }
                    return Ok(users);
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
        /// User, function only for Admin
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="user">User to get all info</param>
        /// <returns>User</returns>
        [HttpPost("user")]
        public IActionResult GetUser([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] User user)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    User _user = _context.users.AsNoTracking().Where(u => u.Id == user.Id).FirstOrDefault();
                    _user.Password = null;
                    _user.Token = null;
                    return Ok(_user);
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
        /// Add new user, only Admin has parmission
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="user">user to add</param>
        /// <returns>Status Ok when user add succesfull</returns>
        [HttpPost("new")]
        public async Task<IActionResult> CreateNewUser([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] User user)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    int us = _context.users.Where(u => u.Login == user.Login).Count();
                    if (us == 0)
                    {
                        user.Password = Hasing(user.Password);
                        user.Token = GenareteUserToken(user.Login);
                        _context.Add(user);
                        await _context.SaveChangesAsync();
                        return Ok(user.Id);
                    }
                    else
                        return BadRequest("notAdmin");
                }
                else
                    return BadRequest();
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Change user password, only Admin has permission to change Users password
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="user">User to reset password</param>
        /// <returns>Status Ok when password has successfull change</returns>
        [HttpPut("resetPassword")]
        public async Task<IActionResult> ChangeUserPassword([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] User user)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    User us = _context.users.AsNoTracking().Where(u => u.Id == user.Id).FirstOrDefault();
                    if (us != null)
                    {
                        User x = us;
                        // hasing user password
                        x.Password = Hasing(user.Password);
                        _context.Update(x);
                        await _context.SaveChangesAsync();
                        var status = "ok";
                        return Ok(new { status });
                    }
                    else
                        return BadRequest();
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
        /// Change own passowrd
        /// </summary>
        /// <param name="login">user login/param>
        /// <param name="token">user token</param>
        /// <param name="user">User to change password</param>
        /// <returns>Return status Ok when successfull password change</returns>
        [HttpPut("selfResetPassword")]
        public async Task<IActionResult> SelfChangePassword([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] UserSelfResetPassword user)
        {
            try
            {
                User us = _context.users.AsNoTracking().Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.Active == 1).FirstOrDefault();
                if (us != null)
                {
                    string pwCheck = PassHash(us, user.OldPassword);
                    if (pwCheck.Equals(us.Password))
                    {
                        us.Password = Hasing(user.NewPassword);
                        _context.Update(us);
                        await _context.SaveChangesAsync();
                        var status = "ok";
                        return Ok(new { status });
                    }
                    else
                        return BadRequest();
                }
                else
                    return BadRequest();
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Upadte user - only Admin has permisions
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="user">User to change</param>
        /// <returns>Status Ok when, succesfull</returns>
        [HttpPut("update")]
        public IActionResult UpdateUser([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] User user)
        {
            try
            {
                User admin = _context.users.AsNoTracking().Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    User us = _context.users.AsNoTracking().Where(u => u.Id == user.Id).FirstOrDefault();
                    if (us != null)
                    {
                        User x = user;
                        x.Password = us.Password;
                        x.Token = us.Token;
                        _context.Update(x);
                        _context.SaveChanges();
                        var status = "ok";
                        return Ok(new { status });
                    }
                    else
                        return BadRequest();
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
        /// Deactivate User - only for Admin
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="user">User to deactivated</param>
        /// <returns>Return Ok when user succesfull deactivated</returns>
        [HttpPut("deactivate")]
        public async Task<IActionResult> DeactivateUser([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] User user)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    User us = _context.users.AsNoTracking().Where(u => u.Id == user.Id).FirstOrDefault();
                    if (us != null)
                    {
                        us.Active = 0;
                        _context.Update(us);
                        await _context.SaveChangesAsync();
                        var status = "ok";
                        return Ok(new { status });
                    }
                    else
                        return BadRequest();
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
        /// Activate User - only for Admin
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="user">User to activated</param>
        /// <returns>Return Ok when user succesfull Activated</returns>
        [HttpPut("activate")]
        public async Task<IActionResult> ActivateUser([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] User user)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    User us = _context.users.AsNoTracking().Where(u => u.Id == user.Id).FirstOrDefault();
                    if (us != null)
                    {
                        us.Active = 1;
                        _context.Update(us);
                        await _context.SaveChangesAsync();
                        var status = "ok";
                        return Ok(new { status });
                    }
                    else
                        return BadRequest();
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
        /// RateWork user - only for Admin
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="body">User to get RateWork</param>
        /// <returns>Returns RateWork user</returns>
        [HttpPost("userRateWork")]
        public IActionResult GetUserRateWork([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] User body)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    RateWork rateWork = _context.rateworks.Where(r => r.UserId == body.Id).FirstOrDefault();
                    return Ok(rateWork);
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
        /// Update user RateWork - only for Admin
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="body">RateWork to update</param>
        /// <returns>Return Ok when succesfull update RateWork</returns>
        [HttpPut("updateUserRateWork")]
        public IActionResult UpdateUserRateWork([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] RateWork body)
        {
            try
            {
                User admin = _context.users.AsNoTracking().Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    User us = _context.users.AsNoTracking().Where(u => u.Id == body.UserId).FirstOrDefault();
                    if (us != null)
                    {
                        RateWork rateWork = _context.rateworks.Where(r => r.UserId == body.UserId).FirstOrDefault();
                        rateWork.RateStd = body.RateStd;
                        rateWork.RateAlter = body.RateAlter;
                        rateWork.RateStdHoliday = body.RateStdHoliday;
                        rateWork.RateAlterHoliday = body.RateAlterHoliday;
                        
                        rateWork.OvertimeStd = body.OvertimeStd;
                        rateWork.OvertimeStdHoliday = body.OvertimeStdHoliday;
                        rateWork.OvertimeAlter = body.OvertimeAlter;
                        rateWork.OvertimeAlterHoliday = body.OvertimeAlterHoliday;
                        
                        _context.Update(rateWork);
                        _context.SaveChanges();
                        var status = "ok";
                        return Ok(new { status });
                    }
                    else
                        return BadRequest();
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
        /// Add rateWork to user - only for admin
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <param name="body">RateWork to add</param>
        /// <returns>Returns Ok when succesfull added RateWork to user</returns>
        [HttpPost("addUserRateWork")]
        public IActionResult AddUserRateWork([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] RateWork body)
        {
            try
            {
                User admin = _context.users.AsNoTracking().Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    User us = _context.users.AsNoTracking().Where(u => u.Id == body.UserId).FirstOrDefault();
                    if (us != null)
                    {
                        RateWork rateWork = new RateWork();
                        rateWork.UserId = body.UserId;
                        rateWork.RateStd = body.RateStd;
                        rateWork.RateAlter = body.RateAlter;
                        rateWork.RateStdHoliday = body.RateStdHoliday;
                        rateWork.RateAlterHoliday = body.RateAlterHoliday;
                        rateWork.OvertimeStd = body.OvertimeStd;
                        rateWork.OvertimeStdHoliday = body.OvertimeStdHoliday;
                        rateWork.OvertimeAlter = body.OvertimeAlter;
                        rateWork.OvertimeAlterHoliday = body.OvertimeAlterHoliday;

                        _context.Add(rateWork);
                        _context.SaveChanges();
                        var status = "ok";
                        return Ok(new { status });
                    }
                    else
                        return BadRequest();
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
        /// Get List contact to users - used in Mobile
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <returns>List of contacts user</returns>
        [HttpGet("usersContact")]
        public IActionResult GetUsersContact([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User us = _context.users.AsNoTracking().Where(u => u.Login == login && u.Token == token && u.Active == 1).FirstOrDefault();
                if (us != null)
                {
                    List<User> listUsers = _context.users.Where(u => u.Active == 1).ToList();
                    List<UserContact> contacts = new List<UserContact>();
                    foreach (var x in listUsers)
                    {
                        // check user has phone number
                        if (x.Phone != null)
                        {
                            UserContact cont = new UserContact();
                            cont.Id = x.Id;
                            cont.Name = x.FirstName + " " + x.LastName;
                            cont.Phone = x.Phone;
                            contacts.Add(cont);
                        }
                    }
                    return Ok(contacts);
                }
                else
                    return BadRequest();
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Hashed new password - used in change or restet password functions
        /// </summary>
        /// <param name="pass">Password to hashed</param>
        /// <returns>Returns new hased with new password</returns>
        private string Hasing(string pass)
        {
            // generate a 128-bit salt using a secure PRNG
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: pass,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return Convert.ToBase64String(salt) + "$" + hashed;
        }

        /// <summary>
        /// Create user token
        /// </summary>
        /// <param name="login">User login to create token</param>
        /// <returns>return created token</returns>
        private string GenareteUserToken(string login)
        {
            // generate a 128-bit salt using a secure PRNG
            byte[] salt = new byte[16 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: login,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 1008,
                numBytesRequested: 128 / 8));

            return hashed;
        }

        /// <summary>
        /// Hashing password
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="password">user password</param>
        /// <returns>Hashed password</returns>
        private string PassHash(User user, string password)
        {
            string PassFromDB = user.Password;

            string[] pass = PassFromDB.Split('$');
            byte[] salt = Convert.FromBase64String(pass[0]);

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return pass[0] + "$" + hashed;
        }

    }
}