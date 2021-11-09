import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstallationService } from 'src/app/services/installation.service';

@Component({
  selector: 'app-downloaded',
  templateUrl: './downloaded.component.html',
  styleUrls: ['./downloaded.component.scss'],
})
export class DownloadedComponent implements OnInit {

  dataList = [];

  constructor(private installService: InstallationService, private router: Router) { }

  ngOnInit() {
    this.loadInstalls();
  }

  doRefresh(event) {
    this.installService.getAllActiveDownloaded().subscribe((data) => {
      this.dataList = data;
      event.target.complete();
    });
  }

  loadInstalls() {
    this.installService.getAllActiveDownloaded().subscribe((data) => {
      this.dataList = data;
    });
  }

  installBtn(id: number) {
    this.router.navigate(['/mv/listDownloaded', id]);
  }

}
