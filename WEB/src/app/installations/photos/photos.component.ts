import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { InstallsService } from 'src/app/services/installs.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  @ViewChild('inputFile') myInputVariable: ElementRef;

  private sub: any;
  installId: number;
  installName: string;

  dataItems = [];

  imageList = [];
  listOfPhotos;

  openModal = false;
  photo: any;

  description: string;

  loading = false;
  valid = false;

  constructor(
    private routerParams: ActivatedRoute,
    private installService: InstallsService,
    private sanitizer: DomSanitizer,
    private ng2ImgMax: Ng2ImgMaxService,
    private toastr: ToastrService
    ) {
    this.photo = { id: 0,
      desc: 'img.description',
      date: 0,
      src: '../../../assets/logo.png',
    };
    }

  ngOnInit(): void {
    this.sub = this.routerParams.params.subscribe(params => {
      this.installId = +params.id;
      this.loadPhotos();
      this.installService.getName(this.installId).subscribe((data) => {
        this.installName = data.name;
      });
    });
  }

  loadPhotos(): void {
    this.installService.getPhotoList(this.installId).subscribe((data) => {
      this.listOfPhotos = data;
      for (const img of this.listOfPhotos) {
        this.installService.getPhoto(img.id).subscribe((photo) => {
          const unsafeImageUrl = URL.createObjectURL(photo);
          this.imageList.push({
            id: img.id,
            desc: img.description,
            date: img.dateAdd,
            src: this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl),
          });
        }, error => {
          console.log(error);
        });
      }
    });
  }

  openImage(img): void {
    this.openModal = true;
    this.photo = img;
  }

  removeImage(img): void {
    this.installService.removePhoto(img.id).subscribe(() => {
      this.listOfPhotos = [];
      this.imageList = [];
      this.toastr.warning('Skasowano zdjęcie');
      this.loadPhotos();
    }, error => {
      this.toastr.error('Błąd kasowania zdjęcia');
    });
  }

  submitPhoto(): void {
    this.installService.uploadPhoto(this.installId, this.description, this.photo).subscribe(() => {
      this.photo = null;
      this.myInputVariable.nativeElement.value = '';
      this.listOfPhotos = [];
      this.imageList = [];
      this.description = '';
      this.valid = false;
      this.toastr.success('Dodano zdjęcie');
      this.loadPhotos();
    }, error => {
      this.toastr.error('Błąd dodania zdjęcia');
    });
  }

  uploadFiles(event): void {
    if (event.target.files && event.target.files[0]) {
      this.loading = true;
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const img = event.target.files[0];

        this.ng2ImgMax.resizeImage(img, 1000, 1000).subscribe(
          result => {
            this.photo = new File([result], img.name);
            this.loading = false;
            this.valid = true;
          },
          error => {
            this.toastr.warning('Nie można załadować zdjęcia');
            this.loading = false;
          }
        );

      };
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e) => {
      };
    }
  }

  get sortData(): any {
    return this.imageList.sort((a, b) => {
      return (new Date(b.date) as any) - (new Date(a.date) as any);
    });
  }

}
