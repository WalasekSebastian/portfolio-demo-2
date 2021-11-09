import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  dataList = [];

  constructor(private ordersService: OrdersService, private router: Router, public toastController: ToastController) { }

  ngOnInit() {
    this.loadOrders();
  }

  ionViewWillEnter() {
    this.loadOrders();
  }

  doRefresh(event) {
    this.ordersService.getAllOrders().subscribe((data) => {
      this.dataList = data;
      event.target.complete();
    });
  }

  editBtn(id: number) {
    this.router.navigate(['/mv/ordersEdit', id]);
  }

  btnAdd() {
    this.router.navigate(['/mv/ordersAdd']);
  }

  loadOrders() {
    this.ordersService.getAllOrders().subscribe((data) => {
      this.dataList = data;
    });
  }

  remove(orderId: number): void {
    this.ordersService.deleteOrder(orderId).subscribe(() => {
      this.presentToast('Skasowano', 3000, 'warning');
      this.loadOrders();
    }, (error) => {
      if (error.error === 'notEmpty') {
        this.presentToast('Zapotrzebowanie nie jest puste!' , 4000, 'danger');
      }
      else {
        this.presentToast('Błąd kasowania', 3000, 'danger');
      }
    });
  }

  async presentToast(msg: string, dur: number, col: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: dur,
      color: col
    });
    toast.present();
  }

}
