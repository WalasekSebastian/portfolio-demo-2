import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Install } from 'src/app/Models/install';
import { InstallationService } from 'src/app/services/installation.service';

@Component({
  selector: 'app-install-add',
  templateUrl: './install-add.component.html',
  styleUrls: ['./install-add.component.scss'],
})
export class InstallAddComponent implements OnInit {

  form: FormGroup;
  newInstall = {} as Install;

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private formBuilder: FormBuilder, private installService: InstallationService, private toastController: ToastController) {
    this.form = this.formBuilder.group({
      firstName: [],
      lastName: [],
      name: ['', Validators.required],
      email: [],
      phone: [],
      street: [],
      number: [],
      postalCode: [],
      city: []
    });
  }

  ngOnInit() { }

  submit() {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.newInstall.name = x.name;
    this.newInstall.firstName = x.firstName;
    this.newInstall.lastName = x.lastName;
    this.newInstall.email = x.email;
    this.newInstall.phone = x.phone;
    this.newInstall.street = x.street;
    this.newInstall.number = x.number;
    this.newInstall.postalCode = x.postalCode;
    this.newInstall.city = x.city;

    this.installService.addInstall(this.newInstall).subscribe(() => {
      this.presentToast('Dodano nowy montaż', 3000, 'success');
      this.router.navigate(['/mv/dashboard']);
    }, (error) => {
      if (error.error === 'exist') {
        this.presentToast('Montaż już istnieje', 5000, 'danger');
      }
      else {
      this.presentToast('Błąd w dodaniu', 5000, 'danger');
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
