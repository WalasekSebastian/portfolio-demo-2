import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-workers-contact',
  templateUrl: './workers-contact.component.html',
  styleUrls: ['./workers-contact.component.scss'],
})
export class WorkersContactComponent implements OnInit {

  filterTerm: string;

  contactsData = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.userService.getContacts().subscribe((data) => {
      this.contactsData = data;
    });
  }

}
