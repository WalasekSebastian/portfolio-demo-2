namespace ServerDEMOSystem.Models
{
    public class User
    {
        public int Id {get;set;}
        public string Login {get;set;}
        public string Password {get;set;}
        public int IsAdmin {get;set;}
        public string Token {get;set;}
        public int Active{get;set;}
        public string FirstName{get;set;}
        public string LastName {get;set;}
        public string Email {get;set;}
        public string Phone {get;set;}
        public int notificationsSMS { get; set; }
    }

    public class UserSelfResetPassword 
    {
        public string OldPassword {get;set;}
        public string NewPassword {get;set;}
    }
}