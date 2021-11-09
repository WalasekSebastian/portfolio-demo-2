import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {

  currentApplicationVersion = environment.appVersion;

  toogle = false;
  toogleItem = false;
  tooglePhotos = false;
  toogleWork = false;

  constructor(private login: LoginService) { }

  ngOnInit() {
    this.toogle = false;
    this.toogleItem = false;
    this.tooglePhotos = false;
  }

  logout() {
    this.login.logout();
  }

}
