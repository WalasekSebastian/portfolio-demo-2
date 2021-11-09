import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InstallsService } from 'src/app/services/installs.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-alternative',
  templateUrl: './alternative.component.html',
  styleUrls: ['./alternative.component.css']
})
export class AlternativeComponent implements OnInit {

  installName: string;
  dataInstalls = [];
  install = null;

  constructor(private settings: SettingsService, private installService: InstallsService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadCurent();
    this.loadInstalls();
  }

  changeAlternative(): void {
    this.settings.changeAlternative(this.install).subscribe(() => {
      this.toastr.success('Zmieniono !');
      this.loadCurent();
    }, error => {
      this.toastr.error('Błąd zmiany !');
    });
  }

  loadCurent(): void {
    this.settings.getAlternative().subscribe((data) => {
      this.installName = data.name;
    });
  }

  loadInstalls(): void {
    this.installService.getAllActiveInstalls().subscribe((data) => {
      this.dataInstalls = data;
    });
  }

}
