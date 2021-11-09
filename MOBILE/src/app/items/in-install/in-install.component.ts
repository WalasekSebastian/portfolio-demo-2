import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstallationService } from 'src/app/services/installation.service';

@Component({
  selector: 'app-in-install',
  templateUrl: './in-install.component.html',
  styleUrls: ['./in-install.component.scss'],
})
export class InInstallComponent implements OnInit {

  dataList = [];

  constructor(private installService: InstallationService, private router: Router) { }

  ngOnInit() {
    this.loadInstalls();
  }

  doRefresh(event) {
    this.installService.getAllActiveInstallsIninstall().subscribe((data) => {
      this.dataList = data;
      event.target.complete();
    });
  }

  loadInstalls() {
    this.installService.getAllActiveInstallsIninstall().subscribe((data) => {
      this.dataList = data;
    });
  }

  installBtn(id: number) {
    this.router.navigate(['/mv/listInInstall', id]);
  }

}
