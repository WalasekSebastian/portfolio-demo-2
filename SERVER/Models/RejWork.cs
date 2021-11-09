using System;

namespace ServerDEMOSystem.Models
{
    public class RejWork
    {
        public int Id {get;set;}
        public int UserId {get;set;}
        public int InstallationId {get;set;}
        public DateTime DateStart {get;set;}
        public DateTime DateEnd {get;set;}
        public TimeSpan TimeTravel {get;set;}
        public String Description {get;set;}
    }

    public class Bonus
    {
        public int Id {get;set;}
        public int RejWorkId {get;set;}
        public int UserId {get;set;}
        public double Value {get;set;}
        public String Description {get;set;}
        public DateTime DateAdd {get;set;}
        public DateTime DateModify {get;set;}
        public int AddUserId{get;set;}
    }
}