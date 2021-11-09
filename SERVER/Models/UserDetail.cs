using System;

namespace ServerDEMOSystem.Models
{
    public class UserDetail
    {
        public int UserId { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
    }

    public class UsersSimply
    {
        public int UserId { get; set; }
        public string Name { get; set; }
    }

    public class UsersSummary
    {
        public int StdHouers { get; set; }
        public int StdMinutes { get; set; }
        public int StdHouersHolidays { get; set; }
        public int StdMinutesHolidays { get; set; }
        public int AlterHouers { get; set; }
        public int AlterMinutes { get; set; }
        public int AlterHouersHolidays { get; set; }
        public int AlterMinutesHolidays { get; set; }
        public int OvertimeStdHouers { get; set; }
        public int OvertimeStdMinutes { get; set; }
        public int OvertimeStdHouersHolidays { get; set; }
        public int OvertimeStdMinutesHolidays { get; set; }
        public int OvertimeAlterHouers { get; set; }
        public int OverimeAlterMinutes { get; set; }
        public int OvertimeAlterHouersHolidays { get; set; }
        public int OvertimeAlterMinutesHolidays { get; set; }

        public double sumStd { get; set; }
        public double sumStdHoliday { get; set; }
        public double sumAlter { get; set; }
        public double sumAlterHoliday { get; set; }
        public double sumOvertimeStd {get;set;}
        public double sumOvertimeStdHoliday {get;set;}
        public double sumOvertimeAlter {get;set;}
        public double sumOvertimeAlterHoliday {get;set;}
        public double sumBonus {get;set;}
        public double sumAll { get; set; }
    }

    public class UsersSummaryMobile
    {
        public string CurrentMonth { get; set; }
        public string LastMonth { get; set; }
    }

    public class RateWork
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public double RateStd { get; set; }
        public double RateStdHoliday { get; set; }
        public double RateAlter { get; set; }
        public double RateAlterHoliday { get; set; }
        public double OvertimeStd { get; set; }
        public double OvertimeStdHoliday { get; set; }
        public double OvertimeAlter { get; set; }
        public double OvertimeAlterHoliday { get; set; }
    }

    public class UserContact
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
    }
}