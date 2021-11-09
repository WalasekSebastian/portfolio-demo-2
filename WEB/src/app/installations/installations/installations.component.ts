import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-installations',
  templateUrl: './installations.component.html',
  styleUrls: ['./installations.component.css']
})
export class InstallationsComponent implements OnInit {

  toogle: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.toogle = false;
  }

  addInstall(): void {
    this.toogle = true;
  }

  addInstallClose(added: string): void {
    if (added === 'true') {
      if (this.router.url === '/mv/installs/list') {
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      }
      this.toogle = false;
    }
    else if (added === 'err') {
      this.toogle = false;
    }
    else if (added === 'false') {
      this.toogle = false;
    }
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

