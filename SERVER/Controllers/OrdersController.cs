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
using System.Net.Http;
using System.Text.Json;
using System.Net.Http.Headers;

namespace ServerDEMOSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class OrdersController : Controller
    {
        private IConfiguration _config;
        private readonly OrdersContext _context;

        public OrdersController(IConfiguration config, OrdersContext context)
        {
            _config = config;
            _context = context;
        }

        [HttpPost("install")]
        public IActionResult GetInstalByOrderId([FromBody] Order body)
        {
            try
            {
                Order order = _context.orders.Where(o => o.Id == body.Id).FirstOrDefault();
                if (order != null)
                {
                    Installation install = _context.installations.Where(i => i.Id == order.InstallationId).FirstOrDefault();
                    return Ok(install);
                }
                else
                    return BadRequest();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("all")]
        public IActionResult GetAllOrders()
        {
            try
            {
                List<Installation> installations = _context.installations.Where(i => i.Active == 1).ToList();
                List<User> users = _context.users.ToList();
                List<Status> statuses = _context.statuses.ToList();
                List<Order> orders = _context.orders.ToList();
                var data = orders.AsQueryable().Join(installations, stdOrders => stdOrders.InstallationId, stdInst => stdInst.Id,
                        (stdOrders, stdInst) => new
                        {
                            id = stdOrders.Id,
                            status = stdOrders.StatusId,
                            install = stdInst.Name,
                            installId = stdInst.Id,
                            CreatedUser = stdOrders.CreatedUserId,
                            DateCreated = stdOrders.DateCreated,
                            LastModified = stdOrders.LastModified
                        }
                    ).Join(users, stdOrders => stdOrders.CreatedUser, stdUsers => stdUsers.Id,
                    (stdOrders, stdUsers) => new
                    {
                        id = stdOrders.id,
                        status = stdOrders.status,
                        install = stdOrders.install,
                        installId = stdOrders.installId,
                        userName = stdUsers.Login,
                        dateCreated = stdOrders.DateCreated,
                        lastModified = stdOrders.LastModified
                    }).Join(statuses, stdorders => stdorders.status, stdStatuses => stdStatuses.Id,
                    (stdOrders, stdStatuses) => new
                    {
                        id = stdOrders.id,
                        status = stdStatuses.Name,
                        install = stdOrders.install,
                        installId = stdOrders.installId,
                        userName = stdOrders.userName,
                        dateCreated = stdOrders.dateCreated,
                        lastModified = stdOrders.lastModified
                    })
                    .ToList().OrderByDescending(d => d.lastModified);
                return Ok(data);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("allActive")]
        public IActionResult GetAllOrdersActive()
        {
            try
            {
                List<Installation> installations = _context.installations.Where(i => i.Active == 1).ToList();
                List<User> users = _context.users.ToList();
                List<Status> statuses = _context.statuses.ToList();
                List<Order> orders = _context.orders.Where(o => o.StatusId != 4).ToList();
                List<PriorityStatus> priority = _context.prioritystatus.ToList();
                var data = orders.AsQueryable().Join(installations, stdOrders => stdOrders.InstallationId, stdInst => stdInst.Id,
                        (stdOrders, stdInst) => new
                        {
                            id = stdOrders.Id,
                            status = stdOrders.StatusId,
                            install = stdInst.Name,
                            installId = stdInst.Id,
                            CreatedUser = stdOrders.CreatedUserId,
                            DateCreated = stdOrders.DateCreated,
                            LastModified = stdOrders.LastModified,
                            PriorityStatus = stdOrders.PriorityStatusId,
                            PriorityDate = stdOrders.PriorityDate
                        }
                    ).Join(users, stdOrders => stdOrders.CreatedUser, stdUsers => stdUsers.Id,
                    (stdOrders, stdUsers) => new
                    {
                        id = stdOrders.id,
                        status = stdOrders.status,
                        install = stdOrders.install,
                        installId = stdOrders.installId,
                        userName = stdUsers.Login,
                        dateCreated = stdOrders.DateCreated,
                        lastModified = stdOrders.LastModified,
                        PriorityDate = stdOrders.PriorityDate,
                        PriorityStatus = stdOrders.PriorityStatus,
                    }).Join(statuses, stdorders => stdorders.status, stdStatuses => stdStatuses.Id,
                    (stdOrders, stdStatuses) => new
                    {
                        id = stdOrders.id,
                        status = stdStatuses.Name,
                        install = stdOrders.install,
                        installId = stdOrders.installId,
                        userName = stdOrders.userName,
                        dateCreated = stdOrders.dateCreated,
                        lastModified = stdOrders.lastModified,
                        PriorityDate = stdOrders.PriorityDate,
                        PriorityStatus = stdOrders.PriorityStatus
                    }).Join(priority, stdOrders => stdOrders.PriorityStatus, stdPrio => stdPrio.Id,
                    (stdOrders, stdPrio) => new
                    {
                        id = stdOrders.id,
                        status = stdOrders.status,
                        install = stdOrders.install,
                        installId = stdOrders.installId,
                        userName = stdOrders.userName,
                        dateCreated = stdOrders.dateCreated,
                        lastModified = stdOrders.lastModified,
                        PriorityDate = stdOrders.PriorityDate,
                        PriorityStatus = stdOrders.PriorityStatus,
                        PriorityName = stdPrio.Name
                    }
                    )
                    .ToList().OrderByDescending(d => d.lastModified);
                return Ok(data);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("allConfirmed")]
        public IActionResult GetAllOrdersConfirmed()
        {
            try
            {
                List<Installation> installations = _context.installations.Where(i => i.Active == 1).ToList();
                List<User> users = _context.users.ToList();
                List<Status> statuses = _context.statuses.ToList();
                List<Order> orders = _context.orders.Where(o => o.StatusId == 4).ToList();
                var data = orders.AsQueryable().Join(installations, stdOrders => stdOrders.InstallationId, stdInst => stdInst.Id,
                        (stdOrders, stdInst) => new
                        {
                            id = stdOrders.Id,
                            status = stdOrders.StatusId,
                            install = stdInst.Name,
                            installId = stdInst.Id,
                            CreatedUser = stdOrders.CreatedUserId,
                            DateCreated = stdOrders.DateCreated,
                            LastModified = stdOrders.LastModified
                        }
                    ).Join(users, stdOrders => stdOrders.CreatedUser, stdUsers => stdUsers.Id,
                    (stdOrders, stdUsers) => new
                    {
                        id = stdOrders.id,
                        status = stdOrders.status,
                        install = stdOrders.install,
                        installId = stdOrders.installId,
                        userName = stdUsers.Login,
                        dateCreated = stdOrders.DateCreated,
                        lastModified = stdOrders.LastModified
                    }).Join(statuses, stdorders => stdorders.status, stdStatuses => stdStatuses.Id,
                    (stdOrders, stdStatuses) => new
                    {
                        id = stdOrders.id,
                        status = stdStatuses.Name,
                        install = stdOrders.install,
                        installId = stdOrders.installId,
                        userName = stdOrders.userName,
                        dateCreated = stdOrders.dateCreated,
                        lastModified = stdOrders.lastModified
                    })
                    .ToList().OrderByDescending(d => d.lastModified);
                return Ok(data);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("allitemsininstallation/{id}")]
        public IActionResult GetAllItems(int id)
        {
            try
            {
                Installation install = _context.installations.Where(i => i.Id == id).FirstOrDefault();
                List<User> users = _context.users.ToList();
                List<Unit> units = _context.units.ToList();

                // #98 If Qty == 0 don't add this item to response
                List<ItemsInInstall> items = _context.itemsininstall.Where(i => i.InstallId == id && i.Quantity != 0).ToList();

                List<ItemsInInstallReturn> response = new List<ItemsInInstallReturn>();
                foreach (var x in items)
                {
                    ItemsInInstallReturn res = new ItemsInInstallReturn();
                    res.Id = x.Id;
                    res.Name = x.Name;
                    res.Quantity = x.Quantity;
                    res.UnitName = units.Where(u => u.Id == x.UnitId).FirstOrDefault().ShortName;

                    User temp = users.Where(u => u.Id == x.UserId).FirstOrDefault();
                    if (temp.LastName == null || temp.FirstName == null)
                        res.UserName = temp.Login;
                    else
                        res.UserName = temp.FirstName + " " + temp.LastName;

                    res.DateAdd = x.DateAdd;
                    res.DateModify = x.DateModify;
                    res.InstallName = install.Name;
                    response.Add(res);
                }
                InstallItems iss = new InstallItems();
                iss.InstallName = install.Name;
                iss.items = response.OrderByDescending(d => d.DateModify).ToList();
                return Ok(iss);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("allitemsininstallationdownloaded")]
        public IActionResult GetAllItemsDownloaded([FromForm] int id, [FromForm] bool settled)
        {
            try
            {
                Installation install = _context.installations.Where(i => i.Id == id).FirstOrDefault();
                List<User> users = _context.users.ToList();
                List<Unit> units = _context.units.ToList();
                List<DownloadedItems> items = new List<DownloadedItems>();
                if (settled)
                    items = _context.downloadeditems.Where(i => i.InstallId == id).ToList();
                else
                    items = _context.downloadeditems.Where(i => i.InstallId == id && i.Settled == 0).ToList();

                List<DownloadedItemsReturn> response = new List<DownloadedItemsReturn>();
                foreach (var x in items)
                {
                    DownloadedItemsReturn res = new DownloadedItemsReturn();
                    res.Id = x.Id;
                    res.InstallName = install.Name;
                    res.Name = x.Name;
                    res.Quantity = x.Quantity;
                    res.UnitName = units.Where(u => u.Id == x.UnitId).FirstOrDefault().ShortName;
                    res.UnitId = x.UnitId;
                    User temp = users.Where(u => u.Id == x.UserId).FirstOrDefault();
                    if (temp.LastName == null || temp.FirstName == null)
                        res.UserName = temp.Login;
                    else
                        res.UserName = temp.FirstName + " " + temp.LastName;

                    res.Date = x.Date;
                    res.Settled = x.Settled;
                    response.Add(res);
                }
                DownItems iss = new DownItems();
                iss.InstallName = install.Name;
                iss.items = response.OrderByDescending(d => d.Date).ToList();
                return Ok(iss);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPut("settled")]
        public IActionResult SettledItems([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] ItemsToSettled body)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin == 10).Single();
                if (admin != null)
                {
                    foreach (var x in body.Items)
                    {
                        DownloadedItems item = _context.downloadeditems.Where(i => i.Name == x.Name && i.UnitId == x.UnitId && i.Settled == 1).FirstOrDefault();
                        if (item != null)
                        {
                            item.Quantity += x.Quantity;
                            item.Date = DateTime.Now;
                            item.Settled = 1;
                            _context.Update(item);
                            _context.SaveChanges();
                            DownloadedItems di = _context.downloadeditems.Where(i => i.Id == x.Id).FirstOrDefault();
                            _context.Remove(di);
                            _context.SaveChanges();
                        }
                        else
                        {
                            DownloadedItems di = _context.downloadeditems.Where(i => i.Id == x.Id).FirstOrDefault();
                            di.Settled = 1;
                            di.Date = DateTime.Now;
                            _context.Update(di);
                            _context.SaveChanges();
                        }
                    }
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

        [HttpGet("allitem/{id}")]
        public IActionResult GetAllItemsInOrder(int id)
        {
            try
            {
                Order order = _context.orders.Where(o => o.Id == id).FirstOrDefault();
                Installation installation = _context.installations.Where(i => i.Id == order.InstallationId).FirstOrDefault();
                List<User> users = _context.users.ToList();
                List<Status> statuses = _context.statuses.ToList();
                List<ItemsOrder> items = _context.itemsorder.Where(i => i.OrderId == id && i.Active == 1).ToList();
                List<Unit> unites = _context.units.ToList();
                List<ItemsReturn> data = new List<ItemsReturn>();

                foreach (var x in items)
                {
                    ItemsReturn item = new ItemsReturn();
                    item.Id = x.Id;
                    item.Name = x.Name;
                    item.Quantity = x.Quantity;
                    item.UnitName = unites.Where(u => u.Id == x.UnitId).FirstOrDefault().ShortName.ToString();
                    item.UserName = users.Where(u => u.Id == x.UserId).FirstOrDefault().Login.ToString();
                    item.DateAdd = x.DateAdd;
                    item.DateModify = x.DateModify;
                    item.Confirm = x.Confirm;
                    data.Add(item);
                }

                return Ok(data);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("allitemactive")]
        public IActionResult GetAllItemsActive()
        {
            try
            {
                List<Order> listOrder = _context.orders.Where(o => o.StatusId <= 3).ToList();

                var inInstall = from order in listOrder
                                join install in _context.installations
                                on order.InstallationId equals install.Id
                                select install;
                List<Installation> listInstall = inInstall.ToList();


                List<User> users = _context.users.ToList();
                List<Status> statuses = _context.statuses.ToList();

                var inItems = from order in listOrder
                              join ite in _context.itemsorder
                              on order.Id equals ite.OrderId
                              where ite.Active == 1
                              select ite;
                List<ItemsOrder> items = inItems.ToList();

                List<Unit> unites = _context.units.ToList();
                List<ItemsAllReturn> data = new List<ItemsAllReturn>();

                foreach (var x in items)
                {
                    ItemsAllReturn item = new ItemsAllReturn();
                    item.Id = x.Id;
                    item.OrderId = x.OrderId;
                    item.InstallId = listOrder.Where(o => o.Id == x.OrderId).FirstOrDefault().InstallationId;
                    item.Status = statuses.Where(s => s.Id == (listOrder.Where(o => o.Id == x.OrderId).FirstOrDefault().StatusId)).FirstOrDefault().Name;
                    item.InstallName = listInstall.Where(i => i.Id == (listOrder.Where(o => o.Id == x.OrderId).FirstOrDefault().InstallationId)).FirstOrDefault().Name;
                    item.Name = x.Name;
                    item.Quantity = x.Quantity;
                    item.UnitName = unites.Where(u => u.Id == x.UnitId).FirstOrDefault().ShortName.ToString();
                    item.UserName = users.Where(u => u.Id == x.UserId).FirstOrDefault().Login.ToString();
                    item.DateAdd = x.DateAdd;
                    item.DateModify = x.DateModify;
                    data.Add(item);
                }

                return Ok(data.OrderBy(d => d.InstallName));
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPut("remove")]
        public async Task<IActionResult> DeactivateItemInOrder([FromBody] ItemsOrder body)
        {
            try
            {
                ItemsOrder item = _context.itemsorder.AsNoTracking().Where(u => u.Id == body.Id).FirstOrDefault();
                if (item != null)
                {
                    item.Active = 0;
                    _context.Update(item);
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

        [HttpPut("changeItemMobile")]
        public async Task<IActionResult> ChangeItemMobile([FromBody] ItemsOrder body)
        {
            try
            {
                ItemsOrder item = _context.itemsorder.AsNoTracking().Where(u => u.Id == body.Id).FirstOrDefault();
                if (item != null)
                {
                    item.Name = body.Name;
                    item.Quantity = body.Quantity;
                    item.DateModify = DateTime.Now;
                    _context.Update(item);
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

        [HttpPut("updateItem")]
        public async Task<IActionResult> UpdateItem([FromBody] ItemOrderChange body)
        {
            try
            {
                ItemsOrder item = _context.itemsorder.AsNoTracking().Where(u => u.Id == body.Id).FirstOrDefault();
                if (item != null)
                {
                    Unit unite = _context.units.Where(u => u.ShortName == body.Unit).FirstOrDefault();
                    item.Name = body.Name;
                    item.Quantity = body.Qty;
                    item.UnitId = unite.Id;
                    item.DateModify = DateTime.Now;
                    _context.Update(item);
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

        [HttpPut("divideqty")]
        public async Task<IActionResult> DivideQty([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] ItemDivide body)
        {
            try
            {
                User admin = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1 && u.IsAdmin == 10).Single();
                if (admin != null)
                {
                    ItemsOrder item = _context.itemsorder.AsNoTracking().Where(u => u.Id == body.Id).FirstOrDefault();
                    if (item != null)
                    {
                        item.Quantity = body.Qty;
                        item.DateModify = DateTime.Now;
                        _context.Update(item);

                        ItemsOrder newItem = new ItemsOrder();
                        newItem.OrderId = item.OrderId;
                        newItem.Name = item.Name;
                        newItem.Quantity = body.QtyNew;
                        newItem.UnitId = item.UnitId;
                        newItem.DateAdd = DateTime.Now;
                        newItem.DateModify = DateTime.Now;
                        newItem.UserId = admin.Id;
                        newItem.Active = 1;
                        newItem.Confirm = 0;
                        _context.Add(newItem);

                        await _context.SaveChangesAsync();
                        var status = "ok";
                        return Ok(new { status });
                    }
                    else
                        return BadRequest();
                }
                else
                    return BadRequest("Not Admin");
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("add")]
        public IActionResult AddOrder([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] NewOrder body)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    Order order = new Order();
                    order.InstallationId = body.InstallId;
                    order.StatusId = 1;
                    order.CreatedUserId = user.Id;
                    order.DateCreated = DateTime.Now;
                    order.LastModified = DateTime.Now;
                    if (body.PriorityStatusId == 0)
                    {
                        order.PriorityStatusId = 3;
                    }
                    else
                    {
                        order.PriorityStatusId = body.PriorityStatusId;
                        order.PriorityDate = body.PriorityDate;
                    }

                    _context.Add(order);
                    _context.SaveChanges();

                    List<Unit> unites = _context.units.ToList();
                    List<ItemsOrder> items = new List<ItemsOrder>();
                    foreach (var x in body.items)
                    {
                        ItemsOrder item = new ItemsOrder();
                        item.OrderId = order.Id;
                        item.Name = x.Name;
                        item.Quantity = x.Qty;
                        item.UnitId = unites.Where(u => u.ShortName == x.Unit).FirstOrDefault().Id;
                        item.UserId = user.Id;
                        item.DateAdd = DateTime.Now;
                        item.DateModify = DateTime.Now;
                        item.Active = 1;
                        item.Confirm = 0;
                        items.Add(item);
                    }
                    _context.AddRange(items);
                    _context.SaveChanges();
                    if (order.PriorityStatusId == 1)
                    {
                        Installation install = _context.installations.Where(i => i.Id == order.InstallationId).FirstOrDefault();
                        SMS sms = new SMS(_config);
                        Task task = sms.SendSMS("Dodano nowe PILNE zapotrzebowanie, do montażu: " + install.Name, _context.users.Where(u => u.notificationsSMS == 1).ToList());
                    }
                    return Ok();
                }
                else
                    return BadRequest();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("priorityStatuses")]
        public IActionResult GetPriorityStatuses()
        {
            try
            {
                List<PriorityStatus> list = _context.prioritystatus.ToList();
                return Ok(list);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("addItemsInOrder")]
        public IActionResult AddItemsInOrder([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] NewOrder body)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    Order order = _context.orders.Where(o => o.Id == body.InstallId).FirstOrDefault();

                    List<Unit> unites = _context.units.ToList();
                    List<ItemsOrder> items = new List<ItemsOrder>();
                    foreach (var x in body.items)
                    {
                        ItemsOrder item = new ItemsOrder();
                        item.OrderId = order.Id;
                        item.Name = x.Name;
                        item.Quantity = x.Qty;
                        item.UnitId = unites.Where(u => u.ShortName == x.Unit).FirstOrDefault().Id;
                        item.UserId = user.Id;
                        item.DateAdd = DateTime.Now;
                        item.DateModify = DateTime.Now;
                        item.Active = 1;
                        item.Confirm = 0;
                        items.Add(item);
                    }
                    _context.AddRange(items);
                    _context.SaveChanges();
                    return Ok();
                }
                else
                    return BadRequest();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("allstatuses")]
        public IActionResult GetAllStatuses()
        {
            try
            {
                List<Status> statuses = _context.statuses.ToList();
                return Ok(statuses);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("allunits")]
        public IActionResult GetAllunits()
        {
            try
            {
                List<Unit> units = _context.units.ToList();
                return Ok(units);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("statusoforder/{id}")]
        public IActionResult GetStatusOfOrder(int id)
        {
            try
            {
                Order order = _context.orders.Where(o => o.Id == id).FirstOrDefault();
                var ret = new
                {
                    statusId = order.StatusId
                };
                return Ok(ret);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPut("statusupdate")]
        public async Task<IActionResult> StatusUpdate([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] StatusUpdate st)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin >= 8 && u.Active == 1).Single();
                if (user != null)
                {
                    Order order = _context.orders.Where(o => o.Id == st.OrderId).FirstOrDefault();
                    if (order != null)
                    {
                        order.StatusId = st.StatusNewId;
                        order.LastModified = DateTime.Now;
                        _context.Update(order);
                        await _context.SaveChangesAsync();

                        // #95 If new status.id == 4, then change all item.confirm in this order to 1
                        if (st.StatusNewId == 4)
                        {
                            List<ItemsOrder> itemsInOrder = _context.itemsorder.Where(i => i.OrderId == order.Id && i.Active == 1).ToList();
                            foreach (var x in itemsInOrder)
                            {
                                ItemsInInstall inInstall = _context.itemsininstall.Where(i => i.Name == x.Name && i.InstallId == order.InstallationId && i.UnitId == x.UnitId).FirstOrDefault();
                                if (inInstall != null)
                                {
                                    inInstall.Quantity += x.Quantity;
                                    inInstall.DateModify = DateTime.Now;
                                    _context.Update(inInstall);
                                    x.Confirm = 1;
                                    _context.Update(x);
                                    await _context.SaveChangesAsync();
                                }
                                else
                                {
                                    ItemsInInstall newitem = new ItemsInInstall();
                                    newitem.InstallId = order.InstallationId;
                                    newitem.Name = x.Name;
                                    newitem.Quantity = x.Quantity;
                                    newitem.UnitId = x.UnitId;
                                    newitem.UserId = user.Id;
                                    newitem.DateAdd = DateTime.Now;
                                    newitem.DateModify = DateTime.Now;
                                    _context.Add(newitem);
                                    x.Confirm = 1;
                                    _context.Update(x);
                                    await _context.SaveChangesAsync();
                                }

                                // x.Confirm = 1;
                                // _context.Update(x);
                                // _context.SaveChanges();
                            }
                        }
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

        [HttpPost("deleteorder")]
        public async Task<IActionResult> DeleteOrder([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromForm] int orderId)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.IsAdmin >= 8 && u.Active == 1).Single();
                if (user != null)
                {
                    Order order = _context.orders.Where(o => o.Id == orderId).FirstOrDefault();
                    if (order != null)
                    {
                        // check order has no active items
                        int count = _context.itemsorder.Where(i => i.OrderId == orderId && i.Active == 1).Count();
                        if (count == 0)
                        {
                            // if order is empty, delete order
                            Order or = _context.orders.Where(o => o.Id == orderId).FirstOrDefault();
                            _context.orders.Remove(or);
                            await _context.SaveChangesAsync();

                            // and delete all items is no active
                            List<ItemsOrder> itemsInOrder = _context.itemsorder.Where(i => i.OrderId == orderId).ToList();
                            foreach (var x in itemsInOrder)
                            {
                                _context.Remove(x);
                                await _context.SaveChangesAsync();
                            }

                            return Ok();
                        }
                        else
                            return BadRequest("notEmpty");
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

        [HttpPut("confirmitem")]
        public async Task<IActionResult> ConfirmItem([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] ItemsReturn body)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    ItemsOrder item = _context.itemsorder.Where(i => i.Id == body.Id && i.Confirm == 0).FirstOrDefault();
                    if (item != null)
                    {
                        Order order = _context.orders.Where(o => o.Id == item.OrderId).FirstOrDefault();
                        ItemsInInstall inInstall = _context.itemsininstall.Where(i => i.Name == item.Name && i.InstallId == order.InstallationId && i.UnitId == item.UnitId).FirstOrDefault();
                        if (inInstall != null)
                        {
                            inInstall.Quantity += item.Quantity;
                            inInstall.DateModify = DateTime.Now;
                            _context.Update(inInstall);
                            item.Confirm = 1;
                            _context.Update(item);
                            await _context.SaveChangesAsync();
                            CheckConfirmed(order.Id);
                            return Ok();
                        }
                        else
                        {
                            ItemsInInstall newitem = new ItemsInInstall();
                            newitem.InstallId = order.InstallationId;
                            newitem.Name = item.Name;
                            newitem.Quantity = item.Quantity;
                            newitem.UnitId = item.UnitId;
                            newitem.UserId = user.Id;
                            newitem.DateAdd = DateTime.Now;
                            newitem.DateModify = DateTime.Now;
                            _context.Add(newitem);
                            item.Confirm = 1;
                            _context.Update(item);
                            await _context.SaveChangesAsync();
                            CheckConfirmed(order.Id);
                            return Ok();
                        }
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

        [HttpPut("movetowarehouseitem")]
        public async Task<IActionResult> MoveToWarehouseItem([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] ItemsReturn body)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    ItemsOrder item = _context.itemsorder.Where(i => i.Id == body.Id && i.Confirm == 0).FirstOrDefault();
                    if (item != null)
                    {
                        Order order = _context.orders.Where(o => o.Id == item.OrderId).FirstOrDefault();
                        int warehouseId = _context.settings.Where(s => s.Name == "warehouse").FirstOrDefault().InstallId;
                        ItemsInInstall inInstall = _context.itemsininstall.Where(i => i.Name == item.Name && i.InstallId == warehouseId && i.UnitId == item.UnitId).FirstOrDefault();
                        if (inInstall != null)
                        {
                            inInstall.Quantity += item.Quantity;
                            inInstall.DateModify = DateTime.Now;
                            _context.Update(inInstall);
                            item.Confirm = 0;
                            item.Active = 0;
                            _context.Update(item);
                            await _context.SaveChangesAsync();
                            CheckConfirmed(order.Id);
                            return Ok();
                        }
                        else
                        {
                            ItemsInInstall newitem = new ItemsInInstall();
                            newitem.InstallId = warehouseId;
                            newitem.Name = item.Name;
                            newitem.Quantity = item.Quantity;
                            newitem.UnitId = item.UnitId;
                            newitem.UserId = user.Id;
                            newitem.DateAdd = DateTime.Now;
                            newitem.DateModify = DateTime.Now;
                            _context.Add(newitem);
                            item.Confirm = 0;
                            item.Active = 0;
                            _context.Update(item);
                            await _context.SaveChangesAsync();
                            CheckConfirmed(order.Id);
                            return Ok();
                        }
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

        [HttpPost("getitemdownload")]
        public IActionResult ItemDownloadFromInstall([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] GetDownloadItems body)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    Installation install = _context.installations.Where(i => i.Id == body.InstallId).FirstOrDefault();
                    if (install != null)
                    {
                        Unit unit = _context.units.Where(u => u.ShortName == body.Unit).FirstOrDefault();
                        DownloadedItems item = _context.downloadeditems.Where(i => i.InstallId == install.Id && i.Name == body.Name && i.UnitId == unit.Id && i.Settled == 0).FirstOrDefault();
                        if (item == null)
                        {
                            DownloadedItems it = new DownloadedItems();
                            it.InstallId = install.Id;
                            it.Name = body.Name;
                            it.Quantity = body.Qty;
                            it.UnitId = unit.Id;
                            it.UserId = user.Id;
                            it.Date = DateTime.Now;
                            it.Settled = 0;
                            _context.Add(it);
                            _context.SaveChanges();
                            CheckItemInInstall(it, user, body.Qty);
                            return Ok();
                        }
                        else
                        {
                            item.Quantity += body.Qty;
                            item.Date = DateTime.Now;
                            _context.Update(item);
                            _context.SaveChanges();
                            CheckItemInInstall(item, user, body.Qty);
                            return Ok();
                        }
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

        [HttpPut("moveItem")]
        public IActionResult MoveItem([FromHeader(Name = "login")] string login, [FromHeader(Name = "userToken")] string token, [FromBody] ItemMoved body)
        {
            try
            {
                User user = _context.users.Where(u => u.Login == login && u.Token == token && u.Active == 1).Single();
                if (user != null)
                {
                    ItemsInInstall item = _context.itemsininstall.Where(i => i.Id == body.Id).FirstOrDefault();
                    if (item != null)
                    {
                        if (body.Qty <= item.Quantity)
                        {
                            ItemsInInstall iii = _context.itemsininstall.Where(i => i.InstallId == body.InstallId && i.Name == item.Name && i.UnitId == item.UnitId).FirstOrDefault();
                            if (iii == null)
                            {
                                ItemsInInstall newItem = new ItemsInInstall();
                                newItem.InstallId = body.InstallId;
                                newItem.Name = item.Name;
                                newItem.Quantity = body.Qty;
                                newItem.UnitId = item.UnitId;
                                newItem.UserId = user.Id;
                                newItem.DateAdd = DateTime.Now;
                                newItem.DateModify = DateTime.Now;
                                _context.Add(newItem);
                                _context.SaveChanges();

                                item.Quantity -= body.Qty;
                                item.DateModify = DateTime.Now;
                                _context.Update(item);
                                _context.SaveChanges();

                                return Ok();
                            }
                            else
                            {
                                iii.Quantity += body.Qty;
                                iii.DateModify = DateTime.Now;
                                _context.Update(iii);
                                _context.SaveChanges();

                                item.Quantity -= body.Qty;
                                item.DateModify = DateTime.Now;
                                _context.Update(item);
                                _context.SaveChanges();

                                return Ok();
                            }
                        }
                        else
                            return BadRequest("qtyTooMuch");
                    }
                    else
                        return BadRequest("notExist");
                }
                else
                    return BadRequest();
            }
            catch
            {
                return BadRequest();
            }
        }

        private void CheckConfirmed(int orderId)
        {
            try
            {
                List<ItemsOrder> items = _context.itemsorder.Where(i => i.OrderId == orderId && i.Confirm == 0 && i.Active == 1).ToList();
                if (items.Count == 0)
                {
                    Order order = _context.orders.Where(o => o.Id == orderId).FirstOrDefault();
                    order.StatusId = 4;
                    _context.Update(order);
                    _context.SaveChanges();
                }
            }
            catch
            {

            }
        }

        private void CheckItemInInstall(DownloadedItems item, User user, double Qty)
        {
            try
            {
                ItemsInInstall itm = _context.itemsininstall.Where(i => i.InstallId == item.InstallId && i.Name == item.Name && i.UnitId == item.UnitId).FirstOrDefault();
                if (itm == null)
                {
                    ItemsInInstall iii = new ItemsInInstall();
                    iii.InstallId = item.InstallId;
                    iii.Name = item.Name;
                    iii.Quantity += (Qty) * (-1);
                    iii.UnitId = item.UnitId;
                    iii.UserId = user.Id;
                    iii.DateAdd = DateTime.Now;
                    iii.DateModify = DateTime.Now;
                    _context.Update(iii);
                    _context.SaveChanges();
                }
                else
                {
                    itm.Quantity += (Qty) * (-1);
                    itm.DateModify = DateTime.Now;
                    _context.Update(itm);
                    _context.SaveChanges();
                }
            }
            catch
            {

            }
        }

    }
}