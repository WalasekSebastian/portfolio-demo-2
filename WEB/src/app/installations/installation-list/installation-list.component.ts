import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstallsService } from 'src/app/services/installs.service';

@Component({
  selector: 'app-installation-list',
  templateUrl: './installation-list.component.html',
  styleUrls: ['./installation-list.component.css']
})
export class InstallationListComponent implements OnInit {

  toogle: boolean;
  installId: number;

  active = false;

  installsData = [];

  constructor(private installs: InstallsService, private router: Router) { }

  ngOnInit(): void {
    this.toogle = false;
    this.loadInstalls();
  }

  loadInstalls(): void {
    this.installs.AllInstallsWithContatcs(this.active).subscribe((data) => {
      this.installsData = data;
    });
  }

  itemsInstall(installId: number): void {
    this.router.navigate(['/mv/installs/items', installId]);
  }

  itemsDownloaded(installId: number): void {
    this.router.navigate(['/mv/installs/downloaded', installId]);
  }

  photos(installId: number): void {
    this.router.navigate(['/mv/installs/photos', installId]);
  }

  deactivateInstall(id: number): void {
    this.installs.deactivateInstall(id).subscribe(() => {
      this.loadInstalls();
    });
  }

  activateInstall(id: number): void {
    this.installs.activateInstall(id).subscribe(() => {
      this.loadInstalls();
    });
  }

  editInstall(id: number): void {
    this.toogle = true;
    this.installId = id;
  }

  editInstallClose(added: string): void {
    if (added === 'true') {
      this.loadInstalls();
      this.toogle = false;
    }
    if (added === 'err') {
      this.toogle = false;
    }
    else if (added === 'false') {
      this.toogle = false;
    }
  }

  workHistory(installId: number): void {
    this.router.navigate(['/mv/installs/workHistory', installId]);
  }

  showDeaciveded(): void {
    this.loadInstalls();
  }

  checkPermissions(): boolean {
    if ((localStorage.getItem('isAdmin') === '8') || (localStorage.getItem('isAdmin') === '10')) {
      return true;
    }
    else {
      return false;
    }
  }
}
