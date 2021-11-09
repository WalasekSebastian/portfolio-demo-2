import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.css']
})
export class OrdersHistoryComponent implements OnInit {

  ordersData = [];

  toogleEdit: boolean;
  orderId: number;
  installName: string;
  installId: number;

  constructor(private ordersService: OrdersService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getAllOrdersConfirmed().subscribe((data) => {
      this.ordersData = data;
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
      this.toastr.success('Zaktualizowano');
      this.loadOrders();
    }
    else if (added === 'false') {
      this.toastr.error('Błąd aktualizacji');
    }
    else if (added === 'close') {
      this.toogleEdit = false;
    }
  }

}
