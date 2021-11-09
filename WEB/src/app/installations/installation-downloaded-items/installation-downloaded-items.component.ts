import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstallsService } from 'src/app/services/installs.service';
import { DatePipe } from '@angular/common';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { OrdersService } from 'src/app/services/orders.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-installation-downloaded-items',
  templateUrl: './installation-downloaded-items.component.html',
  styleUrls: ['./installation-downloaded-items.component.css']
})
export class InstallationDownloadedItemsComponent implements OnInit {

  private sub: any;
  installId: number;
  installName: string;

  dataItems = [];

  selected = [];
  settleded = false;

  constructor(
    private routerParams: ActivatedRoute,
    private installService: InstallsService,
    public datepipe: DatePipe,
    private orderService: OrdersService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.sub = this.routerParams.params.subscribe(params => {
      this.installId = +params.id;
      this.loadItems();
    });
  }

  loadItems(): void {
    this.installService.getAllDownloadedItemsInInstall(this.installId, this.settleded).subscribe((data) => {
      this.dataItems = data.items;
      this.installName = data.installName;
    });
  }

  export(): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Lista pobrań z ' + this.installName);

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Nazwa', key: 'name', width: 32 },
      { header: 'Ilość', key: 'quantity', width: 10 },
      { header: 'Jm', key: 'unitName', width: 10 },
      { header: 'Kto pobrał', key: 'userName', width: 20 },
      { header: 'Data', key: 'date', width: 20 },
    ];

    this.dataItems.forEach(e => {
      worksheet.addRow({
        id: e.id,
        name: e.name,
        quantity: e.quantity,
        unitName: e.unitName,
        userName: e.userName,
        date: this.datepipe.transform(e.date, 'dd-MM-yyyy')
      }, 'n');
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, this.installName + '.xlsx');
    });
  }

  checkPermissions(): boolean {
    if (localStorage.getItem('isAdmin') === '10') {
      return true;
    }
    else {
      return false;
    }
  }

  settled(): void {
    this.orderService.settledItems(this.installId, this.selected).subscribe(() => {
      this.toastr.success('Rozliczono');
      this.loadItems();
    }, error => {
      this.toastr.error('Błąd przy rozliczaniu');
    });
  }

  toogle(): void {
    this.loadItems();
  }

}
