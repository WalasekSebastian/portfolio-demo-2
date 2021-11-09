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

namespace ServerDEMOSystem.Controllers
{
    [Route("api/[controller]")]
    public class loginController : Controller
    {
        private IConfiguration _config;
        private readonly LoginContext _context;
        private User _user = null;

        public loginController(IConfiguration config, LoginContext context)
        {
            _config = config;
            _context = context;
        }

        /// <summary>
        /// Log-in user
        /// </summary>
        /// <param name="login">Pametrers to log-in</param>
        /// <returns>Ok when user exist, Unauthorized when user not exist or password is wrong</returns>
        [AllowAnonymous]
        [HttpPost]
        public IActionResult CreateToken([FromBody]User login)
        {
            IActionResult response = Unauthorized();

            // check log-in 
            if (LoginUser(login.Login, login.Password))
            {
                var tokenJWT = BuildTokenJWT(_user);
                var Login = _user.Login;
                var userIsAdmin = _user.IsAdmin;
                var Token = _user.Token;

                response = Ok(new { tokenJWT = tokenJWT, login = Login, isAdmin = userIsAdmin, token = Token});
            }

            return response;
        }

        /// <summary>
        /// Build user Token JWT
        /// </summary>
        /// <param name="user">User parms to build token</param>
        /// <returns>Token JWT user</returns>
        private string BuildTokenJWT(User user)
        {
            // set params to create token
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, user.Login),
                new Claim(JwtRegisteredClaimNames.Email, user.Password),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.AuthTime, DateTime.Now.ToString())
               };

            // set Security Key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("alelalamanochala"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken("",
              "",
              claims,
              expires: DateTime.Now.AddDays(1),
              signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Check user can log-in
        /// </summary>
        /// <param name="login">User login</param>
        /// <param name="password">User password</param>
        /// <returns>True when user exist and password is ok, false when user not exist or password is wrong</returns>
        public bool LoginUser(string login, string password)
        {
            try
            {
                _user  =_context.users.Where(x=> x.Login == login && x.Active == 1).Single();
                if (_user != null)
                {
                    // check password to log-in is the same of password in DB
                    string ps = PassHash(login, password);
                    if (ps.Equals(_user.Password))
                    {
                        return true;
                    }
                    else
                    {
                        Console.Error.WriteLine("Error login User: " + login + " - wrong password");
                        return false;
                    }
                    
                }
                else
                {
                    Console.Error.WriteLine("Error login User: " + login);
                    return false;
                }
            } 
            catch (Exception ex)
            {
                Console.Error.WriteLine("Error login User: " + login + " ex: " + ex.StackTrace);
                return false;
            }
        }

        /// <summary>
        /// Hashing password
        /// </summary>
        /// <param name="login">user login</param>
        /// <param name="password">user password</param>
        /// <returns>Hashed password</returns>
        private string PassHash(string login, string password)
        {
            User user = _context.users.Where(x => x.Login == login).Single();
            string PassFromDB = user.Password;

            string[] pass = PassFromDB.Split('$');
            byte[] salt = Convert.FromBase64String(pass[0]);

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256/8));

            return pass[0]+"$"+hashed;
        }
    }
}