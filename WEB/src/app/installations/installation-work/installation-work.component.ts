import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { InstallsService } from 'src/app/services/installs.service';

@Component({
  selector: 'app-installation-work',
  templateUrl: './installation-work.component.html',
  styleUrls: ['./installation-work.component.css']
})
export class InstallationWorkComponent implements OnInit {

  installWorkData = [];

  private sub: any;
  installId: number;
  installName: string;

  constructor(private routerParams: ActivatedRoute, private installService: InstallsService, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.sub = this.routerParams.params.subscribe(params => {
      this.installId = +params.id;
      this.installService.getAllWorksInInstall(this.installId).subscribe((data) => {
        this.installWorkData = data;
      });
      this.installService.getInstall(this.installId).subscribe((data) => {
        this.installName = data.name;
      });
    });
  }

  export(): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Lista prac ' + this.installName);

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 8 },
      { header: 'Imię i nazwisko', key: 'name', width: 32 },
      { header: 'Data', key: 'date', width: 16 },
      { header: 'Czas pracy (od- do)', key: 'timeWork', width: 20 },
      { header: 'Czas pracy (HH:mm)', key: 'timeDuration', width: 20 },
      { header: 'Czas dojazdu', key: 'timeTravel', width: 16 },
      { header: 'Opis', key: 'desc', width: 60 },
    ];

    this.installWorkData.forEach(e => {
      worksheet.addRow({
        id: e.id,
        name: e.name,
        date: e.date,
        timeWork: e.timeWork,
        timeDuration: e.timeDuration,
        timeTravel: e.timeTravel,
        desc: e.desc,
      }, 'n');
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.installName + '.xlsx');
    });
  }

}
