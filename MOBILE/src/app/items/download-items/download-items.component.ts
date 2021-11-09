import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { InstallationService } from 'src/app/services/installation.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-download-items',
  templateUrl: './download-items.component.html',
  styleUrls: ['./download-items.component.scss'],
})
export class DownloadItemsComponent implements OnInit {

  dataInstalls = [];
  dataUnits = [];
  install = null;

  form: FormGroup;

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
  }

  ngOnInit() {
    this.loadInstalls();
    this.loadUnits();
  }

  submit() {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.orderService.addDownloaded(this.install, x.name, x.qty, x.unit).subscribe(() => {
      this.presentToast('Pobrano', 1500, '');
      this.form.reset();
    }, error => {
      this.presentToast('Błąd', 2000, 'danger');
    });
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

  async presentToast(msg: string, dur: number, col: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: dur,
      color: col
    });
    toast.present();
  }

}
