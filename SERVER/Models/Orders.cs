using System;
using System.Collections.Generic;

namespace ServerDEMOSystem.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int InstallationId { get; set; }
        public int StatusId { get; set; }
        public int CreatedUserId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastModified { get; set; }
        public int PriorityStatusId { get; set; }
        public DateTime PriorityDate { get; set; }

    }

    public class Status 
    {
        public int Id {get;set;}
        public string Name {get;set;}
    }

    public class PriorityStatus 
    {
        public int Id {get;set;}
        public string Name {get;set;}
    }

    public class StatusUpdate
    {
        public int OrderId {get;set;}
        public int StatusNewId {get;set;}
    }

    public class NewOrder
    {
        public int InstallId {get;set;}
        public List<ItemOrderSimply> items {get;set;}
        public int PriorityStatusId { get; set; }
        public DateTime PriorityDate { get; set; }
    }

    public class ItemOrderSimply
    {
        public string Name {get;set;}
        public double Qty {get;set;}
        public string Unit {get;set;}

    }

    public class ItemOrderChange
    {
        public int Id {get;set;}
        public string Name {get;set;}
        public double Qty {get;set;}
        public string Unit {get;set;}

    }

    public class ItemsOrder
    {
        public int Id {get;set;}
        public int OrderId {get;set;}
        public string Name {get;set;}
        public double Quantity {get;set;}
        public int UnitId {get;set;}
        public int UserId {get;set;}
        public DateTime DateAdd {get;set;}
        public DateTime DateModify {get;set;}
        public int Active {get;set;}
        public int Confirm {get;set;}
    }

    public class ItemDivide
    {
        public int Id {get;set;}
        public double Qty {get;set;}
        public double QtyNew {get;set;}
    }

    public class ItemsInInstall
    {
        public int Id {get;set;}
        public int InstallId {get;set;}
        public string Name {get;set;}
        public double Quantity {get;set;}
        public int UnitId {get;set;}
        public int UserId {get;set;}
        public DateTime DateAdd {get;set;}
        public DateTime DateModify {get;set;}
    }

    public class DownloadedItems
    {
        public int Id {get;set;}
        public int InstallId {get;set;}
        public string Name {get;set;}
        public double Quantity {get;set;}
        public int UnitId {get;set;}
        public int UserId {get;set;}
        public DateTime Date {get;set;}
        public int Settled {get;set;}
    }

    public class DownloadedItemsReturn
    {
        public int Id {get;set;}
        public string InstallName {get;set;}
        public string Name {get;set;}
        public double Quantity {get;set;}
        public string UnitName {get;set;}
        public int UnitId {get;set;}
        public string UserName {get;set;}
        public DateTime Date {get;set;}
        public int Settled {get;set;}
    }

    public class ItemsToSettled
    {
        public int InstallId {get;set;}
        public List<DownloadedItemsReturn> Items {get;set;}
    }

    public class ItemsInInstallReturn
    {
        public int Id {get;set;}
        public string InstallName {get;set;}
        public string Name {get;set;}
        public double Quantity {get;set;}
        public string UnitName {get;set;}
        public string UserName {get;set;}
        public DateTime DateAdd {get;set;}
        public DateTime DateModify {get;set;}
    }

    public class InstallItems
    {
        public string InstallName {get;set;}
        public List<ItemsInInstallReturn> items {get;set;}
    }

    public class DownItems
    {
        public string InstallName {get;set;}
        public List<DownloadedItemsReturn> items {get;set;}
    }
    public class ItemsReturn
    {
        public int Id {get;set;}
        public string Name {get;set;}
        public double Quantity {get;set;}
        public string UnitName {get;set;}
        public string UserName {get;set;}
        public DateTime DateAdd {get;set;}
        public DateTime DateModify {get;set;}
        public int Confirm {get;set;}
    }

    public class ItemsAllReturn
    {
        public int Id {get;set;}
        public int OrderId {get;set;}
        public int InstallId {get;set;}
        public string Status {get;set;}
        public string InstallName {get;set;}
        public string Name {get;set;}
        public double Quantity {get;set;}
        public string UnitName {get;set;}
        public string UserName {get;set;}
        public DateTime DateAdd {get;set;}
        public DateTime DateModify {get;set;}
    }

    public class GetDownloadItems
    {
        public int InstallId {get;set;}
        public string Name {get;set;}
        public double Qty {get;set;}
        public string Unit {get;set;}
    }

    public class ItemMoved
    {
        public int Id {get;set;}
        public double Qty {get;set;}
        public int InstallId {get;set;}
    }
}