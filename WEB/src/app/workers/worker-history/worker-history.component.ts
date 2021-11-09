import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { WorksService } from 'src/app/services/works.service';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-worker-history',
  templateUrl: './worker-history.component.html',
  styleUrls: ['./worker-history.component.css']
})
export class WorkerHistoryComponent implements OnInit {

  workerData = [];
  users = [];
  dateFrom;
  dateTo;
  dateFromOld;
  dateToOld;
  summary;

  showExport = false;

  form: FormGroup;
  formBonus: FormGroup;

  openBonusModal: boolean;

  bonusItem: any;
  userIdBonus: number;

  toogleEditWork: boolean;
  rejWorkId: number;

  toogleRemoveWork: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private workService: WorksService,
    public datepipe: DatePipe,
    private toastr: ToastrService) {
    this.openBonusModal = false;
    this.form = this.formBuilder.group({
      worker: new FormControl('', Validators.required),
      dataOd: new FormControl('', Validators.required),
      dataDo: new FormControl('', Validators.required),
    });
    this.formBonus = this.formBuilder.group({
      bonus: new FormControl('', Validators.required),
      desc: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }


  submit(): void {
    const x = JSON.parse(JSON.stringify(this.form.value));

    if (this.checkAdmin()) {
      this.userIdBonus = x.worker.userId;
      this.dateFromOld = this.dateFrom;
      this.dateToOld = this.dateTo;
      this.workService.getUserWorksAdmin(x.worker.userId, this.dateFrom, this.dateTo).subscribe((data) => {
        this.workerData = data;
        this.showExport = true;
      });
      this.workService.getUserSummary(x.worker.userId, this.dateFrom, this.dateTo).subscribe((data) => {
        this.summary = data;
        this.showExport = true;
      });
    }
    else {
      this.workService.getUserWorks(x.worker.userId, this.dateFrom, this.dateTo).subscribe((data) => {
        this.workerData = data;
        this.showExport = true;
      });
    }
  }

  loadUsers(): void {
    this.userService.getAllUsersSimply().subscribe((data) => {
      this.users = data;
    });
  }

  export(): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Lista pracy');

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Imię i nazwisko', key: 'name', width: 32 },
      { header: 'Data', key: 'date', width: 10 },
      { header: 'Montaż', key: 'installName', width: 10 },
      { header: 'Czas pracy od-do', key: 'timeWork', width: 15 },
      { header: 'Długość pracy', key: 'timeDuration', width: 15 },
      { header: 'Czas dojazdu', key: 'timeTravel', width: 15 },
      { header: 'Opis', key: 'desc', width: 15 },
    ];

    this.workerData.forEach(e => {
      worksheet.addRow({
        id: e.id,
        name: e.name,
        date: e.date,
        installName: e.installName,
        timeWork: e.timeWork,
        timeDuration: e.timeDuration,
        timeTravel: e.timeTravel,
        desc: e.desc
      }, 'n');
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'lista-pracy.xlsx');
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

  bonusOpen(bonusItem): void {
    this.bonusItem = bonusItem;
    this.openBonusModal = true;
    this.formBonus = this.formBuilder.group({
      bonus: new FormControl(bonusItem.bonus, Validators.required),
      desc: new FormControl(bonusItem.bonDesc),
    });
  }

  submitBonus(): void {
    const x = JSON.parse(JSON.stringify(this.formBonus.value));
    this.workService.bonusWork(this.bonusItem.id, this.userIdBonus, x.bonus, x.desc).subscribe(() => {
      this.openBonusModal = false;
      this.toastr.success('Dodano bonus pracowniczy');
      this.reloadDataUser();
    });
  }

  clear(e): void {
    if (e) {
      this.form.get('worker').reset();
    }
  }

  reloadDataUser(): void {
    if (this.checkAdmin()) {
      this.workService.getUserWorksAdmin(this.userIdBonus, this.dateFromOld, this.dateToOld).subscribe((data) => {
        this.workerData = data;
      });
      this.workService.getUserSummary(this.userIdBonus, this.dateFromOld, this.dateToOld).subscribe((data) => {
        this.summary = data;
        this.showExport = true;
      });
    }
  }

  editWork(rejId: number): void {
    this.rejWorkId = rejId;
    this.toogleEditWork = true;
  }

  editWorkClose(added: string): void {
    if (added === 'true') {
      this.toogleEditWork = false;
      this.reloadDataUser();
    }
    else if (added === 'false') {
    }
    else if (added === 'close') {
      this.toogleEditWork = false;
    }
  }

  removeWork(rejId: number): void {
    this.rejWorkId = rejId;
    this.toogleRemoveWork = true;
  }

  removeWorkClose(added: string): void {
    if (added === 'true') {
      this.toogleRemoveWork = false;
      this.reloadDataUser();
    }
    else if (added === 'false') {
    }
    else if (added === 'close') {
      this.toogleRemoveWork = false;
    }
  }

}
