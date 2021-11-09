import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from 'src/app/services/orders.service';
import { SettingsService } from '../services/settings.service';
import { WorksService } from '../services/works.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  ordersData = [];

  workerData = [];

  alertType: string;
  alertMsg: string;

  toogleEdit: boolean;
  orderId: number;
  installName: string;
  installId: number;

  toogleEditWork: boolean;
  rejWorkId: number;

  toogleRemoveWork: boolean;

  hddInfo = [];


  constructor(
    private ordersService: OrdersService,
    private worksService: WorksService,
    private settingsService: SettingsService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    if (this.checkPermissions()) {
      this.loadWorks();
    }
    if (this.checkAdmin()) {
      this.loadHddInfo();
    }
  }

  checkPermissions(): boolean {
    if ((localStorage.getItem('isAdmin') === '8') || (localStorage.getItem('isAdmin') === '10')) {
      return true;
    }
    else {
      return false;
    }
  }

  checkAdmin(): boolean {
    if (localStorage.getItem('isAdmin') === '10') {
      return true;
    }
    else {
      return false;
    }
  }

  loadHddInfo(): void {
    this.settingsService.getHDDInfo().subscribe((data) => {
      this.hddInfo = data;
    });
  }

  loadOrders(): void {
    this.ordersService.getAllOrdersActive().subscribe((data) => {
      this.ordersData = data;
    });
  }

  loadWorks(): void {
    this.worksService.lastUsersWorks().subscribe((data) => {
      this.workerData = data;
    });
  }

  edit(id: number, installName: string, instId: number): void {
    this.toogleEdit = true;
    this.orderId = id;
    this.installName = installName;
    this.installId = instId;
  }

  editClose(added: string): void {
    if (added === 'true') {
      this.toogleEdit = false;
      this.toastr.success('Zaaktualizowano');
      this.loadOrders();
    }
    else if (added === 'false') {
      this.toastr.error('Błąd aktualizacji');
    }
    else if (added === 'close') {
      this.toogleEdit = false;
    }
  }

  editWork(rejId: number): void {
    this.rejWorkId = rejId;
    this.toogleEditWork = true;
  }

  editWorkClose(added: string): void {
    if (added === 'true') {
      this.toogleEditWork = false;
      this.loadWorks();
    }
    else if (added === 'false') {
    }
    else if (added === 'close') {
      this.toogleEditWork = false;
    }
  }

  removeWork(rejId: number): void {
    this.rejWorkId = rejId;
    this.toogleRemoveWork = true;
  }

  removeWorkClose(added: string): void {
    if (added === 'true') {
      this.toogleRemoveWork = false;
      this.loadWorks();
    }
    else if (added === 'false') {
    }
    else if (added === 'close') {
      this.toogleRemoveWork = false;
    }
  }

}
