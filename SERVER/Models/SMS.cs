using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace ServerDEMOSystem.Models
{
    /// <summary>
    /// Send SMS via SMSApi
    /// </summary>
    public class SMS
    {
        private readonly IConfiguration _config;

        /// <summary>
        /// Set config file appsettings.json
        /// </summary>
        /// <param name="config">Configuration appsettings.json</param>
        public SMS(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Send SMS with body to list Users 
        /// </summary>
        /// <param name="textToSend">Body text SMS</param>
        /// <param name="listUserToSendSMS">List users to send SMS</param>
        public async Task SendSMS(string textToSend, List<User> listUserToSendSMS)
        {
            try
            {
                HttpClient http = new HttpClient();
                
                // Get values from config
                var token = _config["SMSApi:Token"];
                var fromName = _config["SMSApi:FromName"];

                foreach (var x in listUserToSendSMS)
                {
                    var ms = new
                    {
                        from = fromName,
                        to = x.Phone,
                        message = textToSend,
                        format = "json",
                        encoding = "utf-8",
                        normalize = "1"
                    };

                    var message = JsonSerializer.Serialize(ms);

                    var request = new HttpRequestMessage(HttpMethod.Post, "https://api.smsapi.pl/sms.do");
                    request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    request.Content = new StringContent(message, Encoding.UTF8);
                    request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                    var response = await http.SendAsync(request);
                    response.EnsureSuccessStatusCode();
                    var content = await response.Content.ReadAsStringAsync();
                    if(response.StatusCode != System.Net.HttpStatusCode.OK)
                    {
                        Console.WriteLine(content);
                    }
                }
            }
            catch
            {
            }
        }
    }
}