import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  @ViewChild('focus') inputElement: ElementRef;
  currentApplicationVersion = environment.appVersion;

  isBad: boolean;
  isWorking: boolean;

  form: FormGroup;

  constructor(private router: Router, private login: LoginService, private formBuilder: FormBuilder) {
    this.isBad = false;
    this.isWorking = false;
    this.form = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.login.logout();
  }

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
        this.router.navigate(['/mv/']);
      },
    error => {
      this.isBad = true;
      this.isWorking = false;
      this.form.reset();
      setTimeout(() => {
        this.inputElement.nativeElement.focus();
      });
    });

  }

}
