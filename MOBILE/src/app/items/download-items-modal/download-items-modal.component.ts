import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { InstallationService } from 'src/app/services/installation.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-download-items-modal',
  templateUrl: './download-items-modal.component.html',
  styleUrls: ['./download-items-modal.component.scss'],
})
export class DownloadItemsModalComponent implements OnInit {

  @Input() item: any;
  @Input() installId: number;

  form: FormGroup;

  dataInstalls = [];
  dataUnits = [];

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    private orderService: OrdersService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      qty: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  submit() {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.orderService.addDownloaded(this.installId, this.item.name, x.qty, this.item.unitName).subscribe(() => {
      this.presentToast('Pobrano', 1500, '');
      this.form.reset();
      this.dismissModal();
    }, error => {
      this.presentToast('Błąd', 2000, 'danger');
    });
  }

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true
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
