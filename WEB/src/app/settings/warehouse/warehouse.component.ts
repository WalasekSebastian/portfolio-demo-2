import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InstallsService } from 'src/app/services/installs.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {

  installName: string;
  dataInstalls = [];
  install = null;

  constructor(private settings: SettingsService, private installService: InstallsService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadCurent();
    this.loadInstalls();
  }

  changeWarehouse(): void {
    this.settings.changeWarehouse(this.install).subscribe(() => {
      this.toastr.success('Zmieniono !');
      this.loadCurent();
    }, error => {
      this.toastr.error('Błąd zmiany !');
    });
  }

  loadCurent(): void {
    this.settings.getWarehouse().subscribe((data) => {
      this.installName = data.name;
    });
  }

  loadInstalls(): void {
    this.installService.getAllActiveInstalls().subscribe((data) => {
      this.dataInstalls = data;
    });
  }

}
