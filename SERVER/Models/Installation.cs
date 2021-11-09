using System;
using System.Collections.Generic;

namespace ServerDEMOSystem.Models
{
    public class Installation
    {
        public int Id {get;set;}
        public string Name {get;set;}
        public string FirstName{get;set;}
        public string LastName {get;set;}
        public string Email {get;set;}
        public string Phone {get;set;}
        public string Street {get;set;}
        public string Number {get;set;}
        public string PostalCode {get;set;}
        public string City {get;set;}
        public int Active{get;set;}

    }

    public class InstallationReturn
    {
        public int Id {get;set;}
        public string Name {get;set;}
        public string FirstName{get;set;}
        public string LastName {get;set;}
        public string Email {get;set;}
        public string Phone {get;set;}
        public string Street {get;set;}
        public string Number {get;set;}
        public string PostalCode {get;set;}
        public string City {get;set;}
        public int Active{get;set;}
        public List<ContactInstall> contacts {get;set;}

    }

    public class InstallMobileContact
    {
        public string Name {get;set;}
        public bool Toogle {get;set;}
        public List<ContactInstall> contacts {get;set;}

    }

    public class ContactInstall
    {
        public int Id {get;set;}
        public int InstallId {get;set;}
        public string Name {get;set;}
        public string Phone {get;set;}
        public string Email {get;set;}
        public DateTime DateModify {get;set;}
        public int Active {get;set;}
    }

    public class Photo
    {
        public int Id {get;set;}
        public int InstallationId {get;set;}
        public string FileName {get;set;}
        public int UserId {get;set;}
        public string Description {get;set;}
        public DateTime DateAdd {get;set;}
    }

    public class InstallDetail
    {
        public int InstallId { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
    }
}