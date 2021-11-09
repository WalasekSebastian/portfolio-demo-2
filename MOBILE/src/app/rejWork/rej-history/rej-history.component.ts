import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { StringifyOptions } from 'node:querystring';
import { WorkService } from 'src/app/services/work.service';

@Component({
  selector: 'app-rej-history',
  templateUrl: './rej-history.component.html',
  styleUrls: ['./rej-history.component.scss'],
})
export class RejHistoryComponent implements OnInit {

  userWorkHistory = [];
  userWorkData = [];
  summary;

  type: string;

  form: FormGroup;

  history;

  constructor(
    private router: Router,
    private workService: WorkService,
    private formBuilder: FormBuilder,
    public toastController: ToastController) {
    this.form = this.formBuilder.group({
      dateStart: ['', Validators.required],
      dateEnd: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadHistory();
    this.type = 'all';
  }

  ionViewWillEnter() {
    this.loadHistory();
  }

  editBtn(id: number) {
    this.router.navigate(['/mv/EditWork', id]);
  }

  doRefresh(event) {
    this.workService.getUserWorkHistory().subscribe((data) => {
      this.userWorkHistory = data;
      event.target.complete();
    });
  }

  loadHistory() {
    this.workService.getUserWorkHistory().subscribe((data) => {
      this.userWorkHistory = data;
    });
  }

  getDayName(day: string): string {
    const date = new Date(day);
    let dayName: string;
    switch (date.getDay()) {
      case 0:
        dayName = 'nd';
        break;
      case 1:
        dayName = 'pn';
        break;
      case 2:
        dayName = 'wt';
        break;
      case 3:
        dayName = 'śr';
        break;
      case 4:
        dayName = 'cz';
        break;
      case 5:
        dayName = 'pt';
        break;
      case 6:
        dayName = 'so';
        break;
      default:
        dayName = '??';
        break;
    }
    return dayName;
  }

  async presentToast(msg: string, dur: number, col: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: dur,
      color: col
    });
    toast.present();
  }

  submit() {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.workService.getUserWorks(x.dateStart, x.dateEnd).subscribe((data) => {
      this.userWorkData = data;
    }, (error) => {
      this.presentToast('Błąd pobrania danych', 5000, 'danger');
    });
    this.workService.getUserWorksSummary(x.dateStart, x.dateEnd).subscribe((data) => {
      this.summary = data;
    }, (error) => {
      this.presentToast('Błąd pobrania danych', 5000, 'danger');
    });
  }

}
