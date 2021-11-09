import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {

  isBad: boolean;
  isWorking: boolean;

  form: FormGroup;

  constructor(private router: Router,
              private login: LoginService,
              public toastController: ToastController,
              private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


ngOnInit() { }

loginUser(): void {
  this.isBad = false;
  this.isWorking = true;

  const x = JSON.parse(JSON.stringify(this.form.value));

  this.login.login(x.login, x.password).subscribe(
    (data: any) => {
      localStorage.setItem('tokenJWT', data.tokenJWT);
      localStorage.setItem('login', data.login);
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAdmin', data.isAdmin);
      this.router.navigate(['/mv/dashboard']);
    },
    error => {
      this.isBad = true;
      this.isWorking = false;
      this.presentToast();
      this.form.reset();
    });

}

async presentToast() {
  const toast = await this.toastController.create({
    message: 'Błędny login lub hasło',
    duration: 3000,
    color: 'danger'
  });
  toast.present();
}
}
