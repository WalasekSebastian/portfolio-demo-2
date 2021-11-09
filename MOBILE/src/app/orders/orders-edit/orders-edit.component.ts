import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { InstallationService } from 'src/app/services/installation.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-orders-edit',
  templateUrl: './orders-edit.component.html',
  styleUrls: ['./orders-edit.component.scss'],
})
export class OrdersEditComponent implements OnInit {

  dataList = [];
  dataItem = [];
  dataInstalls = [];
  dataUnits = [];

  form: FormGroup;
  formChange: FormGroup;

  install = null;

  orderId: number;
  orderName;
  status: number;
  statusBefore: number;
  compareWith: any;

  isOpenChange = false;
  itemChange: any;

  private sub: any;

  btnValid = true;

  constructor(public toastController: ToastController,
              public alertController: AlertController,
              private router: Router,
              private routerParams: ActivatedRoute,
              private ordersService: OrdersService,
              private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      qty: ['', Validators.required],
      unit: ['', Validators.required]
    });
    this.formChange = this.formBuilder.group({
      name: ['', Validators.required],
      qty: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.sub = this.routerParams.params.subscribe(params => {
      this.orderId = +params.id;
      this.loadStatusOrder();
      this.ordersService.getInstallByOrderId(this.orderId).subscribe((data) => {
        this.orderName = data.name;
      });
    });
    this.loadUnits();
    this.loadItems();
    this.compareWith = this.compareWithFn;
  }

  submit() {
    this.dataItem.push(this.form.value);
    this.ordersService.addItemsInOrder(this.orderId, this.dataItem).subscribe((data) => {
      this.dataItem = [];
      this.presentToast('Dodano!', 2000, 'success');
      this.form.reset();
      this.loadItems();
    });
  }

  remove(itemId: number) {
    this.ordersService.removeItem(itemId).subscribe(() => {
      this.loadItems();
      this.presentToast('Usunięto!', 2000, 'danger');
    });
  }

  confirm(itemId: any) {
    this.ordersService.confirmItem(itemId).subscribe(() => {
      this.loadItems();
    });
  }

  moveToWarehouse(itemId: any) {
    this.ordersService.moveToWarehouseItem(itemId).subscribe(() => {
      this.loadItems();
    });
  }

  loadItems(): void {
    this.ordersService.getAllItemInOrder(this.orderId).subscribe((data) => {
      this.dataList = data;
    });
  }

  loadStatusOrder(): void {
    this.ordersService.getOrderStatus(this.orderId).subscribe((data) => {
      this.statusBefore = data.statusId;
      this.status = data.statusId;
    });
  }

  loadUnits(): void {
    this.ordersService.getAllUnits().subscribe((data) => {
      this.dataUnits = data;
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

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'UWAGA',
      message: 'Czy wysłać zapotrzebowanie?',
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.ordersService.addOrder(this.install, null, null, this.dataList).subscribe((data) => {
              this.presentToast('Dodano zapotrzebowanie', 3000, 'success');
              this.router.navigate(['/mv/orders']);
            },
              error => {
                this.presentToast('Błąd dodania', 5000, 'danger');
              });
          }
        }
      ]
    });

    await alert.present();
  }

  changeOpen(item: any) {
    this.isOpenChange = true;
    this.itemChange = item;
    this.formChange = this.formBuilder.group({
      name: [item.name, Validators.required],
      qty: [item.quantity, Validators.required],
    });
  }

  submitChange() {
    const x = JSON.parse(JSON.stringify(this.formChange.value));
    this.itemChange.quantity = x.qty;
    this.itemChange.name = x.name;
    this.ordersService.changeItem(this.itemChange).subscribe(() => {
      this.isOpenChange = false;
      this.form.reset();
      this.formChange.reset();
      this.loadItems();
    });
  }

  cancel() {
    this.isOpenChange = false;
  }

  checkPermissions(): boolean {
    if ((localStorage.getItem('isAdmin') === '8') || (localStorage.getItem('isAdmin') === '10')) {
      return true;
    }
    else {
      return false;
    }
  }

  compareWithFn(o1, o2) {
    return o1 === o2;
  }

  statusChange(e) {
    this.status = e.detail.value;
  }

  updateStatus() {
    this.btnValid = false;
    this.ordersService.statusUpdate(this.orderId, this.status).subscribe(() => {
      this.presentToast('Zaaktualizowano status', 3000, 'success');
      this.router.navigate(['/mv/orders']);
    },
      error => {
        this.btnValid = true;
        this.presentToast('Błąd zmiany statusu', 5000, 'danger');
      });
  }

}
