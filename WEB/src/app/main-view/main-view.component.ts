import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  currentApplicationVersion = environment.appVersion;


  admin: boolean;

  constructor(private login: LoginService) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.login.logout();
  }

  checkPermissions(): boolean {
    if ((localStorage.getItem('isAdmin') === '8') || (localStorage.getItem('isAdmin') === '10')) {
      return true;
    }
    else {
      return false;
    }
  }

}
