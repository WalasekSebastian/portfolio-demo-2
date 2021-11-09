import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { LogUpdateServiceService } from './services/log-update-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private sw: LogUpdateServiceService) {
    this.sw.checkForUpdates();
  }



  logout() {
    localStorage.removeItem('tokenJWT');
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    localStorage.removeItem('isAdmin');
  }
}
