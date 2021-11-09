import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { WorkService } from 'src/app/services/work.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  currentMonth: string;
  lastMonth: string;

  hddInfo = [];

  constructor(private workService: WorkService, private settingsService: SettingsService) { }

  ngOnInit() {
    this.loadUserSummary();
    if (this.checkAdmin()) {
      this.loadHddInfo();
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  loadUserSummary() {
    this.workService.getUserSummary().subscribe((data) => {
      this.currentMonth = data.currentMonth;
      this.lastMonth = data.lastMonth;
    });
  }

  checkAdmin(): boolean {
    if (localStorage.getItem('isAdmin') === '10') {
      return true;
    }
    else {
      return false;
    }
  }

  loadHddInfo(): void {
    this.settingsService.getHDDInfo().subscribe((data) => {
      this.hddInfo = data;
    });
  }

}
