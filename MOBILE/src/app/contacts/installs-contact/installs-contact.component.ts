import { Component, OnInit } from '@angular/core';
import { InstallationService } from 'src/app/services/installation.service';

@Component({
  selector: 'app-installs-contact',
  templateUrl: './installs-contact.component.html',
  styleUrls: ['./installs-contact.component.scss'],
})
export class InstallsContactComponent implements OnInit {

  filterTerm: string;

  contactsData = [];

  constructor(private installService: InstallationService) { }

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.installService.getContacts().subscribe((data) => {
      this.contactsData = data;
    });
  }
}
