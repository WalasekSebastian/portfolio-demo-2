import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { InstallationService } from 'src/app/services/installation.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-move-item',
  templateUrl: './move-item.component.html',
  styleUrls: ['./move-item.component.scss'],
})
export class MoveItemComponent implements OnInit {

  @Input() item: any;

  installations = [];
  install = null;

  form: FormGroup;

  constructor(
    public modalController: ModalController,
    private instalService: InstallationService,
    private orderService: OrdersService,
    private formBuilder: FormBuilder,
    public toastController: ToastController) {
    this.form = this.formBuilder.group({
      qty: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadInstallations();
  }

  loadInstallations() {
    this.instalService.getAllInstalls().subscribe((data) => {
      this.installations = data;
    });
  }

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  submit() {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.orderService.itemMove(this.item.id, x.qty, this.install).subscribe(() => {
      this.presentToast('Przeniesiono', 1500, '');
      this.form.reset();
      this.dismissModal();
    }, error => {
      this.presentToast('Błąd', 2000, 'danger');
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
