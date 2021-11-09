import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css']
})
export class WorkersComponent implements OnInit {

  toogle: boolean;
  toogleAddWork: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.toogle = false;
  }

  addWorker(): void {
    this.toogle = true;
  }

  addWork(): void {
    this.toogleAddWork = true;
  }

  addWorkerClose(added: string): void {
    if (added === 'true') {
      if (this.router.url === '/mv/workers/list') {
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

  workAddClose(added: string): void {
    if (added === 'true') {
      this.toogleAddWork = false;
    }
    else if (added === 'err') {
      this.toogleAddWork = false;
    }
    else if (added === 'false') {
      this.toogleAddWork = false;
    }
  }

  checkAdmin(): boolean {
    if (localStorage.getItem('isAdmin') === '10') {
      return true;
    }
    else {
      return false;
    }
  }

}
