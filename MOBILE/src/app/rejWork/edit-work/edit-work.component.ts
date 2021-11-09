import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { RejWork } from 'src/app/Models/rejWork';
import { InstallationService } from 'src/app/services/installation.service';
import { WorkService } from 'src/app/services/work.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-work',
  templateUrl: './edit-work.component.html',
  styleUrls: ['./edit-work.component.scss'],
})
export class EditWorkComponent implements OnInit {

  form: FormGroup;
  editWork = {} as RejWork;

  id: number;
  private sub: any;

  installations = [];

  constructor(public toastController: ToastController,
              private router: Router,
              private routerParams: ActivatedRoute,
              private instalService: InstallationService,
              private work: WorkService,
              public datepipe: DatePipe,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loadInstallations();
    this.sub = this.routerParams.params.subscribe(params => {
      this.id = +params.id;
    });
    this.form = this.formBuilder.group({
      install: ['', Validators.required],
      dateStart: ['', Validators.required],
      dateEnd: [''],
      timetravel: [''],
      desc: [''],
    });
    this.getWork();
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

  getWork() {
    this.work.getUserWork(this.id).subscribe((data) => {
      this.editWork = data;
      this.form = this.formBuilder.group({
        install: [this.editWork.installationId, Validators.required],
        dateStart: [this.editWork.dateStart, Validators.required],
        dateEnd: [this.editWork.dateEnd],
        timetravel: [this.editWork.timeTravel],
        desc: [this.editWork.description],
      });
    });
  }

  submit() {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.editWork.installationId = x.install;
    this.editWork.dateStart = x.dateStart;
    if (x.dateEnd === '') {
      this.editWork.dateEnd = '1000-01-01T00:00:00';
    }
    else {
      this.editWork.dateEnd = x.dateEnd;

    }
    if (x.timetravel === '') {
      this.editWork.timeTravel = '00:00';

    }
    else {
      this.editWork.timeTravel = x.timetravel;
    }
    this.editWork.description = x.desc;
    this.work.updateUserWork(this.editWork).subscribe(() => {
      this.presentToast('Edytowano zapis pracy', 3000, 'success');
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
