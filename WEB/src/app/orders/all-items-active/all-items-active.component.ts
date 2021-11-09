import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-all-items-active',
  templateUrl: './all-items-active.component.html',
  styleUrls: ['./all-items-active.component.css']
})
export class AllItemsActiveComponent implements OnInit {

  itemsData = [];

  toogleEdit: boolean;

  orderId: number;
  installName: string;
  installId: number;

  alertType: string;
  alertMsg: string;
  showAlert: boolean;

  constructor(private ordersService: OrdersService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.ordersService.getAllActiveItems().subscribe((data) => {
      this.itemsData = data;
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
      this.loadItems();
    }
    else if (added === 'false') {
      this.toastr.error('Błąd aktualizacji');
    }
    else if (added === 'close') {
      this.loadItems();
      this.toogleEdit = false;
    }
  }

}
