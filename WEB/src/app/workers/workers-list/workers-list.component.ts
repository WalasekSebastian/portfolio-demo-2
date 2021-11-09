import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-workers-list',
  templateUrl: './workers-list.component.html',
  styleUrls: ['./workers-list.component.css']
})
export class WorkersListComponent implements OnInit {

  toogle: boolean;
  tooglePW: boolean;
  userId: number;

  active = false;

  usersData = [];

  constructor(private users: UsersService, private router: Router) {
  }

  ngOnInit(): void {
    this.toogle = false;
    this.tooglePW = false;
    this.loadUsers();
  }

  loadUsers(): void {
    this.users.AllUsers(this.active).subscribe((data) => {
      this.usersData = data;
    });
  }

  deactivateUser(id: number): void {
    this.users.deactivateUser(id).subscribe(() => {
      this.loadUsers();
    });
  }

  activateUser(id: number): void {
    this.users.activateUser(id).subscribe(() => {
      this.loadUsers();
    });
  }

  editWorker(id: number): void {
    this.toogle = true;
    this.userId = id;
  }

  editWorkerClose(added: string): void {
    if (added === 'true') {
      this.toogle = false;
      this.loadUsers();
    }
    if (added === 'err') {
      this.toogle = false;
    }
    else if (added === 'false') {
      this.toogle = false;
    }
  }

  passwordReset(id: number): void {
    this.tooglePW = true;
    this.userId = id;
  }

  passwordResetClose(added: string): void {
    if (added === 'true') {
      this.tooglePW = false;
    }
    if (added === 'err') {
      this.tooglePW = false;
    }
    else if (added === 'false') {
      this.tooglePW = false;
    }
  }

  checkPermissions(): boolean {
    if (localStorage.getItem('isAdmin') === '10') {
      return true;
    }
    else {
      return false;
    }
  }

  showDeaciveded(): void {
    this.loadUsers();
  }

}
