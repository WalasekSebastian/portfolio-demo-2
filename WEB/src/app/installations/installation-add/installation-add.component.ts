import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Install, InstallWithContacts } from '../../Models/install';
import { EventEmitter } from '@angular/core';
import { InstallsService } from 'src/app/services/installs.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-installation-add',
  templateUrl: './installation-add.component.html',
  styleUrls: ['./installation-add.component.css']
})
export class InstallationAddComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<string>();

  form: FormGroup;
  formContact: FormGroup;
  formChangeContact: FormGroup;
  basic: boolean;
  sizeModal;
  newInstall = {} as InstallWithContacts;
  dataContacts = [];
  openChengeModal = false;
  changeContact: any;

  constructor(private formBuilder: FormBuilder, private installServices: InstallsService, private toastr: ToastrService) {
    this.basic = true;
    this.sizeModal = 'lg';
    this.form = this.formBuilder.group({
      name: this.formBuilder.group({
        firstName: [],
        lastName: [],
        name: ['', Validators.required],
      }),
      contact: this.formBuilder.group({
        email: [],
        phone: [],
      }),
      adress: this.formBuilder.group({
        street: [],
        number: [],
        postalCode: [],
        city: [],
      }),
    });
    this.formContact = this.formBuilder.group({
      name: ['', Validators.required],
      phone: [],
      email: []
    });
    this.formChangeContact = this.formBuilder.group({
      name: ['', Validators.required],
      phone: [],
      email: []
    });
  }

  ngOnInit(): void {
  }

  submit(): void {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.newInstall.name = x.name.name;
    this.newInstall.firstName = x.name.firstName;
    this.newInstall.lastName = x.name.lastName;
    this.newInstall.street = x.adress.street;
    this.newInstall.number = x.adress.number;
    this.newInstall.postalCode = x.adress.postalCode;
    this.newInstall.city = x.adress.city;
    this.newInstall.contacts = this.dataContacts;

    this.installServices.addInstall(this.newInstall).subscribe(() => {
      this.basic = false;
      this.toastr.success('Dodano nowy montaż');
      this.newItemEvent.emit('true');
    },
      error => {
        this.basic = false;
        this.toastr.error('Błąd dodania nowego montażu');
        this.newItemEvent.emit('err');
      });
    }

  close(): void {
    this.basic = false;
    this.newItemEvent.emit('false');
  }

  submitChange(): void {
    const x = JSON.parse(JSON.stringify(this.formChangeContact.value));
    const index = this.dataContacts.indexOf(this.changeContact);
    this.changeContact.name = x.name;
    this.changeContact.phone = x.phone;
    this.changeContact.email = x.email;
    this.dataContacts[index] = this.changeContact;
    this.openChengeModal = false;

  }

  changeOpen(contact: any): void {
    this.changeContact = contact;
    this.formChangeContact = this.formBuilder.group({
      name: [this.changeContact.name, Validators.required],
      phone: [this.changeContact.phone],
      email: [this.changeContact.email]
    });
    this.openChengeModal = true;
  }

  submitContact(): void {
    this.dataContacts.push(this.formContact.value);
    this.formContact.reset();
  }

}
