import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstallationService } from 'src/app/services/installation.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {

  dataList = [];

  constructor(private installService: InstallationService, private router: Router) { }

  ngOnInit() {
    this.loadInstalls();
  }

  doRefresh(event) {
    this.installService.getAllActiveInstalls().subscribe((data) => {
      this.dataList = data;
      event.target.complete();
    });
  }

  loadInstalls() {
    this.installService.getAllActiveInstalls().subscribe((data) => {
      this.dataList = data;
    });
  }

  installBtn(id: number) {
    this.router.navigate(['/mv/listPhotos', id]);
  }

}
