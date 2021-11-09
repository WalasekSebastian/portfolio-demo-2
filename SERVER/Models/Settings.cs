
namespace ServerDEMOSystem.Models
{
    public class Settings
    {
        public int Id {get;set;}
        public string Name {get;set;}
        public int InstallId {get;set;}

    }

    public class HDDInfo
    {
        public string Name {get;set;}
        public double FreeSpace {get;set;}
        public double PerFreeSpace {get;set;}
        public double TotalSpace {get;set;}
        public double PerTotalSpace {get;set;}
        public double NotAvaiable {get;set;}
        public double PerNotAvaiable {get;set;}
    }
}