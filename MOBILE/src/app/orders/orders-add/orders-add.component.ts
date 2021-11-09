import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { InstallationService } from 'src/app/services/installation.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-orders-add',
  templateUrl: './orders-add.component.html',
  styleUrls: ['./orders-add.component.scss'],
})
export class OrdersAddComponent implements OnInit {

  dataList = [];
  dataInstalls = [];
  dataUnits = [];
  dataPriorityStatus = [];

  priorityStatus = null;
  priorityDate = null;

  form: FormGroup;
  formChange: FormGroup;

  isOpenChange = false;
  itemChange: any;

  install = null;

  btnValid = true;

  constructor(public toastController: ToastController,
              public alertController: AlertController,
              private router: Router,
              private installService: InstallationService,
              private orderService: OrdersService,
              private formBuilder: FormBuilder) {
                this.form = this.formBuilder.group({
                  name: ['', Validators.required],
                  qty: ['', Validators.required],
                  unit: ['', Validators.required]
                });
                this.formChange = this.formBuilder.group({
                  qty: ['', Validators.required],
                });
               }

  ngOnInit() {
    this.loadInstalls();
    this.loadUnits();
    this.loadPriorityStatus();
  }

  submit() {
    this.dataList.push(this.form.value);
    this.form.reset();
  }

  loadInstalls() {
    this.installService.getAllActiveInstalls().subscribe((data) => {
      this.dataInstalls = data;
    });
  }

  loadUnits(): void {
    this.orderService.getAllUnits().subscribe((data) => {
      this.dataUnits = data;
    });
  }

  loadPriorityStatus(): void {
    this.orderService.getpriorityStatuses().subscribe((data) => {
      this.dataPriorityStatus = data;
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
            this.btnValid = false;
            if (this.priorityDate === null) {
              this.priorityDate = '1000-01-01T00:00:00';
            }
            if (this.priorityStatus === null) {
              this.priorityStatus = 3;
            }
            this.orderService.addOrder(this.install, this.priorityStatus, this.priorityDate, this.dataList).subscribe((data) => {
              this.presentToast('Dodano zapotrzebowanie', 3000, 'success');
              this.router.navigate(['/mv/orders']);
            },
            error => {
              this.presentToast('Błąd dodania', 5000, 'danger');
              this.btnValid = true;
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
      qty: [item.qty, Validators.required],
    });
  }

  submitChange() {
    const x = JSON.parse(JSON.stringify(this.formChange.value));
    const index = this.dataList.indexOf(this.itemChange);
    this.itemChange.qty = x.qty;
    this.dataList[index] = this.itemChange;
    this.isOpenChange = false;
  }

  cancel() {
    this.isOpenChange = false;
  }

}
