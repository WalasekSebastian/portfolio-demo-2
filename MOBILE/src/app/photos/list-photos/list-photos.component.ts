import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { InstallationService } from 'src/app/services/installation.service';

@Component({
  selector: 'app-list-photos',
  templateUrl: './list-photos.component.html',
  styleUrls: ['./list-photos.component.scss'],
})
export class ListPhotosComponent implements OnInit {

  private sub: any;
  installId: number;
  installName: string;

  dataItems = [];

  imageList = [];
  listOfPhotos;

  constructor(
    private routerParams: ActivatedRoute,
    private installService: InstallationService,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    this.sub = this.routerParams.params.subscribe(params => {
      this.installId = +params.id;
      this.loadPhotos();
    });
  }

  loadPhotos() {
    this.installService.getPhotoList(this.installId).subscribe((data) => {
      this.listOfPhotos = data;
      for (const img of this.listOfPhotos) {
        this.installService.getPhoto(img.id).subscribe((photo) => {
          const unsafeImageUrl = URL.createObjectURL(photo);
          this.imageList.push({
            id: img.id,
            desc: img.description,
            date: img.dateAdd,
            src: this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl)
          });
        }, error => {
          console.log(error);
        });
      }
    });
  }

  get sortData() {
    return this.imageList.sort((a, b) => {
      return (new Date(b.date) as any) - (new Date(a.date) as any);
    });
  }


}
