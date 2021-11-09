import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstallsService } from 'src/app/services/installs.service';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-installation-items',
  templateUrl: './installation-items.component.html',
  styleUrls: ['./installation-items.component.css']
})
export class InstallationItemsComponent implements OnInit {

  private sub: any;
  installId: number;
  installName: string;

  dataItems = [];

  constructor(private routerParams: ActivatedRoute, private installService: InstallsService, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.sub = this.routerParams.params.subscribe(params => {
      this.installId = +params.id;
      this.installService.getAllItemsInInstall(this.installId).subscribe((data) => {
        this.dataItems = data.items;
        this.installName = data.installName;
      });
    });
  }

  export(): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Lista materiałów na ' + this.installName);

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Nazwa', key: 'name', width: 32 },
      { header: 'Ilość', key: 'quantity', width: 10 },
      { header: 'Jm', key: 'unitName', width: 10 },
      { header: 'Kto pobrał', key: 'userName', width: 20 },
      { header: 'Data', key: 'dateAdd', width: 20 },
      { header: 'Data modyfikacji', key: 'dateModify', width: 20 },
    ];

    this.dataItems.forEach(e => {
      worksheet.addRow({
        id: e.id,
        name: e.name,
        quantity: e.quantity,
        unitName: e.unitName,
        userName: e.userName,
        dateAdd: this.datepipe.transform(e.dateAdd, 'dd-MM-yyyy'),
        dateModify: this.datepipe.transform(e.dateModify, 'dd-MM-yyyy')
      }, 'n');
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, this.installName + '.xlsx');
    });
  }

}
