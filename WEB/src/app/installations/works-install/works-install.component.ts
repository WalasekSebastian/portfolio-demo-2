import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Workbook } from 'exceljs';
import { ToastrService } from 'ngx-toastr';
import { InstallsService } from 'src/app/services/installs.service';
import { UsersService } from 'src/app/services/users.service';
import { WorksService } from 'src/app/services/works.service';

@Component({
  selector: 'app-works-install',
  templateUrl: './works-install.component.html',
  styleUrls: ['./works-install.component.css']
})
export class WorksInstallComponent implements OnInit {

  workerData = [];
  installs = [];
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

  constructor(
    private formBuilder: FormBuilder,
    private workService: WorksService,
    private installService: InstallsService,
    public datepipe: DatePipe,
    private toastr: ToastrService) {
    this.openBonusModal = false;
    this.form = this.formBuilder.group({
      install: new FormControl('', Validators.required),
      dataOd: new FormControl('', Validators.required),
      dataDo: new FormControl('', Validators.required),
    });
    this.formBonus = this.formBuilder.group({
      bonus: new FormControl('', Validators.required),
      desc: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.loadInstalls();
  }


  submit(): void {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.workService.getInstallWorks(x.install.id, this.dateFrom, this.dateTo).subscribe((data) => {
      this.workerData = data;
      this.showExport = true;
    });
  }

  loadInstalls(): void {
    this.installService.getAllInstalls().subscribe((data) => {
      this.installs = data;
    });
  }

  export(): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Wykaz pracy');

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
      saveAs(blob, 'wykaz pracy.xlsx');
    });
  }

  clear(e): void {
    if (e) {
      this.form.get('install').reset();
    }
  }

}
