import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InstallationService } from 'src/app/services/installation.service';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss'],
})
export class AddPhotoComponent implements OnInit {

  installations = [];
  form: FormGroup;
  newPhotoItem: any;
  photo: any;
  url: any;
  valid: boolean;
  loading: boolean;

  constructor(
    private installService: InstallationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private ng2ImgMax: Ng2ImgMaxService
  ) {
    this.form = this.formBuilder.group({
      install: ['', Validators.required],
      desc: [''],
      photo: ['']
    });
    this.valid = false;
    this.loading = false;
  }

  ngOnInit() {
    this.loadInstallations();
    this.form = this.formBuilder.group({
      install: ['', Validators.required],
      desc: [''],
      photo: ['']
    });
    this.valid = false;
    this.loading = false;
  }

  loadInstallations() {
    this.installService.getAllInstalls().subscribe((data) => {
      this.installations = data;
    });
  }

  submit() {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.installService.uploadPhoto(x.install, x.desc, this.photo).subscribe(() => {
      this.form.reset();
      this.photo = null;
      this.url = null;
      this.router.navigate(['/mv/photos']);
    });
  }

  uploadFiles(event) {
    if (event.target.files && event.target.files[0]) {
      this.loading = true;
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const img = event.target.files[0];

        this.ng2ImgMax.resizeImage(img, 1000, 1000).subscribe(
          result => {
            this.photo = new File([result], img.name);
            this.valid = true;
            this.loading = false;
          },
          error => {
            this.loading = false;
          }
        );

      };
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e) => {
        this.url = reader.result;
      };
    }
  }

}
