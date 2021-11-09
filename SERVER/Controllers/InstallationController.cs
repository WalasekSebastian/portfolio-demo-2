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
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.StaticFiles;

namespace ServerDEMOSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class InstallationController : Controller
    {
        private IConfiguration _config;
        private readonly InstallationContext _context;

        private static Random _random = new Random();

        /// <summary>
        /// Set contex and config 
        /// </summary>
        /// <param name="config">Configuration application</param>
        /// <param name="context">Contex application</param>
        public InstallationController(IConfiguration config, InstallationContext context)
        {
            _config = config;
            _context = context;
        }

        /// <summary>
        /// List of all installations in DB
        /// </summary>
        /// <returns>List installation</returns>
        [HttpGet("all")]
        public IActionResult GetAllInstallation()
        {
            try
            {
                List<Installation> installations = _context.installations.ToList();
                return Ok(installations);
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Installation Name
        /// </summary>
        /// <param name="id">Installation ID</param>
        /// <returns>Installation with only name</returns>
        [HttpPost("installName")]
        public IActionResult InstallationName([FromForm] int id)
        {
            try
            {
                Installation name = new Installation();
                name.Name = _context.installations.Where(i => i.Id == id).FirstOrDefault().Name;
                return Ok(name);
            }
            catch
            {
                return BadRequest();
            }
        }
        
        /// <summary>
        /// List of installation with contacts list
        /// </summary>
        /// <param name="activeOnly">If true, return only active Installation</param>
        /// <returns>List of Installation with all contacts</returns>
        [HttpPost("allWithContacts")]
        public IActionResult AllInstallationWithContactsList([FromForm] bool activeOnly)
        {
            try
            {
                List<Installation> installations = new List<Installation>();

                // Add installtion to list, check activeOnly
                if (!activeOnly)
                    installations = _context.installations.Where(i => i.Active == 1).ToList();
                else
                    installations = _context.installations.ToList();

                List<InstallationReturn> returns = new List<InstallationReturn>();
                foreach (var x in installations)
                {
                    InstallationReturn ret = new InstallationReturn();
                    ret.Id = x.Id;
                    ret.Name = x.Name;
                    ret.FirstName = x.FirstName;
                    ret.LastName = x.LastName;
                    ret.Street = x.Street;
                    ret.Number = x.Number;
                    ret.PostalCode = x.PostalCode;
                    ret.City = x.City;
                    ret.Active = x.Active;
                    ret.contacts = _context.contactsinstall.Where(c => c.InstallId == x.Id && c.Active == 1).ToList();
                    returns.Add(ret);
                }

                return Ok(returns);
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// List of active Installation
        /// </summary>
        /// <returns>List active Instalaltion</returns>
        [HttpGet("allActive")]
        public IActionResult GetAllInstallationActive()
        {
            try
            {
                List<Installation> allInstallation = _context.installations.Where(i => i.Active == 1).ToList();
                return Ok(allInstallation);
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Function used in MOBILE in list of 'Spis materiałów', client req 
        /// </summary>
        /// <returns>List of Installation, where Instalaltion has ItemsInInstall</returns>
        [HttpGet("allInstallInItems")]
        public IActionResult GetAllInstallationHasItemsInInstall()
        {
            try
            {
                List<Installation> allInstallation = _context.installations.Where(i => i.Active == 1).ToList();
                List<Installation> responseInstalls = new List<Installation>();

                // check Installation has value in itemsininstall table.DB
                foreach (var x in allInstallation)
                {
                    int count = _context.itemsininstall.Where(i => i.InstallId == x.Id).Count();
                    if (count > 0)
                        responseInstalls.Add(x);
                }
                return Ok(responseInstalls);
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Function used in MOBILE in list of 'Materiał użyty', client req 
        /// </summary>
        /// <returns>List of Installation, where Instalaltion has DownloadedItems</returns>
        [HttpGet("allInstallDownloaded")]
        public IActionResult GetAllInstallationHasDownloadedItems()
        {
            try
            {
                List<Installation> _allInstallation = _context.installations.Where(i => i.Active == 1).ToList();
                List<Installation> responseInstalls = new List<Installation>();

                // check Installation has value in downloadeditems Table.DB
                foreach (var x in _allInstallation)
                {
                    int count = _context.downloadeditems.Where(i => i.InstallId == x.Id).Count();
                    if (count > 0)
                        responseInstalls.Add(x);
                }
                return Ok(responseInstalls);
            }
            catch
            {
                return BadRequest();
            }
        }
        
        /// <summary>
        /// Full info about Installation
        /// </summary>
        /// <param name="inst">Installation from body request (in real is only ID)</param>
        /// <returns>Installation</returns>
        [HttpPost("inst")]
        public IActionResult GetInstallation([FromBody] Installation inst)
        {
            try
            {
                Installation install = _context.installations.AsNoTracking().Where(u => u.Id == inst.Id).FirstOrDefault();
                return Ok(install);
            }
            catch
            {
                return BadRequest();
            }
        }
        
        /// <summary>
        /// Function used in MOBILE in 'Kontakty -> Montaże'
        /// </summary>
        /// <param name="login">User login</param>
        /// <param name="token">User token</param>
        /// <returns>Lists contacts of Insttaltion has contacts</returns>
        [HttpGet("contactsMobile")]
        public IActionResult GetInstallContact([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User us = _context.users.AsNoTracking().Where(u => u.Login == login && u.Token == token && u.Active == 1).FirstOrDefault();
                if (us != null)
                {
                    List<Installation> installations = _context.installations.Where(i => i.Active == 1).ToList();
                    List<InstallMobileContact> ret = new List<InstallMobileContact>();
                    foreach (var x in installations)
                    {
                        // add to list only when Installation has contact
                        List<ContactInstall> contacts = _context.contactsinstall.Where(c => c.InstallId == x.Id && c.Active == 1 && c.Phone != null).ToList();
                        if (contacts.Count > 0)
                        {
                            InstallMobileContact inst = new InstallMobileContact();
                            inst.Toogle = false;
                            inst.Name = x.Name;
                            inst.contacts = contacts;
                            ret.Add(inst);
                        }
                    }
                    return Ok(ret);
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
        /// Adding new Installtaion (now function used only in MOBILE in 'Dodanie montazu')
        /// </summary>
        /// <param name="inst">Installation parametrs, eg. name, adress etc.</param>
        /// <returns>Status od adding, Ok when succesful, exist when Installtion shortName exist in DB</returns>
        [HttpPost("new")]
        public async Task<IActionResult> CreateNewInstallation([FromBody] Installation inst)
        {
            try
            {
                // check exist Installtion
                int install = _context.installations.Where(u => u.Name == inst.Name).Count();
                if (install == 0)
                {
                    inst.Active = 1;
                    _context.Add(inst);
                    await _context.SaveChangesAsync();

                    // in MOBILE we can add only one contact with no name, so set name do default and this contact to contact DB
                    if ((inst.Phone != null) || (inst.Email != null))
                    {
                        ContactInstall contact = new ContactInstall();
                        contact.InstallId = inst.Id;
                        contact.Name = "domyślny";
                        contact.Phone = inst.Phone;
                        contact.Email = inst.Email;
                        contact.Active = 1;
                        contact.DateModify = DateTime.Now;
                        _context.Add(contact);
                        await _context.SaveChangesAsync();
                    }

                    var status = "ok";
                    return Ok(new { status });
                }
                else
                    return BadRequest(error: "exist");
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Add new Installation with contact list (now Used only in WEB)
        /// </summary>
        /// <param name="body"></param>
        /// <returns>Status od adding, Ok when succesful, exist when Installtion shortName exist in DB</returns>
        [HttpPost("newWithContacts")]
        public async Task<IActionResult> CreateNewInstallationWithContacts([FromBody] InstallationReturn body)
        {
            try
            {
                // check exist Installtion
                int install = _context.installations.Where(u => u.Name == body.Name).Count();
                if (install == 0)
                {
                    // set all params to new Instalaltion
                    Installation newInstall = new Installation();
                    newInstall.Name = body.Name;
                    newInstall.FirstName = body.FirstName;
                    newInstall.LastName = body.LastName;
                    newInstall.Street = body.Street;
                    newInstall.Number = body.Number;
                    newInstall.PostalCode = body.PostalCode;
                    newInstall.City = body.City;
                    newInstall.Active = 1;
                    _context.Add(newInstall);
                    await _context.SaveChangesAsync();

                    // add new contact to Contact DB with Installatio ID
                    foreach (var x in body.contacts)
                    {
                        ContactInstall contact = new ContactInstall();
                        contact.Name = x.Name;
                        contact.Phone = x.Phone;
                        contact.Email = x.Email;
                        contact.DateModify = DateTime.Now;
                        contact.Active = 1;
                        contact.InstallId = newInstall.Id;
                        _context.Add(contact);
                        await _context.SaveChangesAsync();
                    }

                    var status = "ok";
                    return Ok(new { status });
                }
                else
                    return BadRequest(error: "exist");
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Update Instalaltion
        /// </summary>
        /// <param name="inst">Installation to update, with new params</param>
        /// <returns>Status od updateing, Ok when succesful</returns>
        [HttpPut("update")]
        public async Task<IActionResult> Updateinstallation([FromBody] Installation inst)
        {
            try
            {
                Installation install = _context.installations.AsNoTracking().Where(u => u.Id == inst.Id).FirstOrDefault();
                if (install != null)
                {
                    _context.Update(inst);
                    await _context.SaveChangesAsync();
                    var status = "ok";
                    return Ok(new { status });
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
        /// Dactivaed Installtion, only admin has perrmision to deactivated
        /// </summary>
        /// <param name="login">Login user</param>
        /// <param name="token">token user</param>
        /// <param name="inst">Instalaltion to deactivated</param>
        /// <returns>Status Ok, when succesful, 'notAdmin' when user has't perrmision to deactivated</returns>
        [HttpPut("deactivate")]
        public async Task<IActionResult> DeactivateInstallation([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] Installation inst)
        {
            try
            {
                // check user is Admin
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    Installation install = _context.installations.AsNoTracking().Where(u => u.Id == inst.Id).FirstOrDefault();
                    if (install != null)
                    {
                        install.Active = 0;
                        _context.Update(install);
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
        /// Activated Installtion, only admin has perrmision to activated
        /// </summary>
        /// <param name="login">Login user</param>
        /// <param name="token">token user</param>
        /// <param name="inst">Instalaltion to deactivated</param>
        /// <returns>Status Ok, when succesful, 'notAdmin' when user has't perrmision to activated</returns>
        [HttpPut("activate")]
        public async Task<IActionResult> ActivateInstallation([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] Installation inst)
        {
            try
            {
                // check user id Admin
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    Installation install = _context.installations.AsNoTracking().Where(u => u.Id == inst.Id).FirstOrDefault();
                    if (install != null)
                    {
                        install.Active = 1;
                        _context.Update(install);
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
        /// List of contatcts
        /// </summary> 
        /// <param name="body">Instalaltion to returns contacts</param>
        /// <returns>List of contacts specific Instalaltion</returns>
        [HttpPost("getallcontacts")]
        public IActionResult GetAllContactInInstallation([FromBody] Installation body)
        {
            try
            {
                Installation install = _context.installations.Where(i => i.Id == body.Id).FirstOrDefault();
                if (install != null)
                {
                    List<ContactInstall> contacts = _context.contactsinstall.Where(c => c.InstallId == install.Id && c.Active == 1).ToList();
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
        /// Add new contatc to Instalaltion
        /// </summary>
        /// <param name="body">Contacts paramter</param>
        /// <returns>Status Ok when succesfull</returns>
        [HttpPost("addcontact")]
        public IActionResult AddContact([FromBody] ContactInstall body)
        {
            try
            {
                ContactInstall contact = new ContactInstall();
                contact = body;
                contact.DateModify = DateTime.Now;
                contact.Active = 1;
                _context.Add(contact);
                _context.SaveChanges();
                var status = "ok";
                return Ok(new { status });
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Update contatc in Instalaltion
        /// </summary>
        /// <param name="body">Contacts paramter</param>
        /// <returns>Status Ok when succesfull</returns>
        [HttpPut("updatecontact")]
        public IActionResult UpdateContact([FromBody] ContactInstall body)
        {
            try
            {
                body.DateModify = DateTime.Now;
                body.Active = 1;
                _context.Update(body);
                _context.SaveChanges();
                var status = "ok";
                return Ok(new { status });
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Deactivate contatc in Instalaltion
        /// </summary>
        /// <param name="body">Contacts paramter</param>
        /// <returns>Status Ok when succesfull</returns>
        [HttpPut("deactivatecontact")]
        public IActionResult DeactivateContact([FromBody] ContactInstall body)
        {
            try
            {
                ContactInstall contact = _context.contactsinstall.Where(c => c.Id == body.Id).FirstOrDefault();
                contact.DateModify = DateTime.Now;
                contact.Active = 0;
                _context.Update(contact);
                _context.SaveChanges();
                var status = "ok";
                return Ok(new { status });
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// Add photo to Instalaltion
        /// </summary>
        /// <param name="file">File to added</param>
        /// <param name="InstallId">Instalaltion Id to add file</param>
        /// <param name="desc">Description of file</param>
        /// <param name="login">User login</param>
        /// <param name="token">User token</param>
        /// <returns>Status of added file, Ok when succesfull</returns>
        [HttpPost("addPhoto")]
        public async Task<IActionResult> AddPhoto([FromForm] IFormFile file, [FromForm] int InstallId, [FromForm] string desc, [FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    // ganerate random name of file, less chance to duplicate name and add file extension
                    string name = RandomString(16) + Path.GetExtension(file.FileName);

                    // check file has value
                    if (file.Length > 0)
                    {
                        // save file
                        using (var fileStream = new FileStream("files/" + name, FileMode.Create))
                        {
                            await file.CopyToAsync(fileStream);
                        }
                    }

                    // add file info to DB
                    Photo photo = new Photo();
                    photo.FileName = name;
                    photo.InstallationId = InstallId;
                    photo.UserId = user.Id;
                    if (desc == null || desc == "undefined" || desc == "null")
                        desc = "";
                    photo.Description = desc;
                    photo.DateAdd = DateTime.Now;
                    _context.photos.Add(photo);
                    _context.SaveChanges();
                    return Ok(new { ok = "ok" });
                }
                return BadRequest();
            }
            catch
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// List photos in Instalaltion, without file
        /// </summary>
        /// <param name="body">Instalaltion to list photo</param>
        /// <param name="login">user login</param>
        /// <param name="token">user token</param>
        /// <returns>List photos of specyfic Installation, without file</returns>
        [HttpPost("getPhotosFromInstall")]
        public IActionResult GetPhotosInInstallation([FromBody] Installation body, [FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    List<Photo> list = _context.photos.Where(x => x.InstallationId == body.Id).OrderBy(d => d.DateAdd).ToList();
                    return Ok(list);
                }
                else
                    return BadRequest();
            }
            catch
            {
                return NoContent();
            }
        }

        /// <summary>
        /// Function return file
        /// </summary>
        /// <param name="body">Photo parametrs</param>
        /// <param name="login">User login</param>
        /// <param name="token">User token</param>
        /// <returns>File if exist</returns>
        [HttpPost("getPhotos")]
        public async Task<IActionResult> GetPhoto([FromBody] Photo body, [FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    Photo photo = _context.photos.Where(x => x.Id == body.Id).Single();

                    // read file, and add to memory
                    var memory = new MemoryStream();
                    using (var stream = new FileStream("files/" + photo.FileName, FileMode.Open))
                    {
                        await stream.CopyToAsync(memory);
                    }
                    memory.Position = 0;

                    // return file from memory
                    return File(memory, GetContentType("files/" + photo.FileName), photo.FileName);
                }
                else
                    return BadRequest();
            }
            catch
            {
                return NoContent();
            }
        }

        /// <summary>
        /// Daleted file, only Admin has permmisions to deleted
        /// </summary>
        /// <param name="login">User login</param>
        /// <param name="token">User token</param>
        /// <param name="body">Photo to deleted</param>
        /// <returns>Ok when file is deleted</returns>
        [HttpPost("removePhoto")]
        public IActionResult RemovePhoto([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] Photo body)
        {
            try
            {
                // check user is Admin
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin == 10 && u.Active == 1).Single();
                if (admin != null)
                {
                    // check file exist in DB
                    Photo img = _context.photos.Where(p => p.Id == body.Id).FirstOrDefault();
                    if (img != null)
                    {
                        _context.Remove(img);
                        _context.SaveChanges();

                        // check file exist in disk
                        if (System.IO.File.Exists(Path.Combine("files/", img.FileName)))
                        {
                            // if exist, deleted file
                            System.IO.File.Delete(Path.Combine("files/", img.FileName));
                        }
                        else
                            return BadRequest();

                        return Ok();
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
        /// Generate random string of specific length from a-zA-Z0-1
        /// </summary>
        /// <param name="length">Length to generate string</param>
        /// <returns>random String</returns>
        private static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnoprstuwxyz";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[_random.Next(s.Length)]).ToArray());
        }

        /// <summary>
        /// contentType = "application/octet-stream";
        /// </summary>
        /// <param name="path">path file</param>
        /// <returns>string of contentType</returns>
        private string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            string contentType;
            if (!provider.TryGetContentType(path, out contentType))
            {
                contentType = "application/octet-stream";
            }
            return contentType;
        }

    }
}