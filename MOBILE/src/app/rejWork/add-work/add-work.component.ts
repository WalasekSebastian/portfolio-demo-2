import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { RejWork } from 'src/app/Models/rejWork';
import { InstallationService } from 'src/app/services/installation.service';
import { WorkService } from 'src/app/services/work.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-work',
  templateUrl: './add-work.component.html',
  styleUrls: ['./add-work.component.scss'],
})
export class AddWorkComponent implements OnInit {

  form: FormGroup;
  newRejWork = {} as RejWork;

  ds;

  installations = [];

  constructor(public toastController: ToastController,
              private router: Router,
              private instalService: InstallationService,
              private work: WorkService,
              public datepipe: DatePipe,
              private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      install: ['', Validators.required],
      dateStart: ['', Validators.required],
      dateEnd: [''],
      timetravel: ['00:00'],
      desc: [''],
    });
  }

  ngOnInit() {
    this.loadInstallations();
  }

  async presentToast(msg: string, dur: number, col: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: dur,
      color: col
    });
    toast.present();
  }

  loadInstallations() {
    this.instalService.getAllInstalls().subscribe((data) => {
      this.installations = data;
    });
  }

  submit() {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.newRejWork.installationId = x.install;
    this.newRejWork.dateStart = x.dateStart;
    if (x.dateEnd === '') {
      this.newRejWork.dateEnd = '1000-01-01T00:00:00';
    }
    else {
      this.newRejWork.dateEnd = x.dateEnd;

    }
    if (x.timetravel === '') {
      this.newRejWork.timeTravel = '00:00';

    }
    else {
      this.newRejWork.timeTravel = x.timetravel;
    }
    this.newRejWork.description = x.desc;
    this.work.addUserWork(this.newRejWork).subscribe(() => {
      this.presentToast('Dodano zapis pracy', 3000, 'success');
      this.router.navigate(['/mv/WorkHistory']);
    }, (error) => {
      if (error.error === 'exist') {
        this.presentToast('Istnieje rejestracja w tym czasie', 6000, 'warning');
      }
      else {
        this.presentToast('Błąd zapisu', 5000, 'danger');
      }
      });
  }

  timeTravelString(date: Date): string {
    return this.datepipe.transform(date, 'HH:mm');
  }

}
