import { Component, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Install } from '../../Models/install';
import { EventEmitter } from '@angular/core';
import { InstallsService } from 'src/app/services/installs.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-installation-edit',
  templateUrl: './installation-edit.component.html',
  styleUrls: ['./installation-edit.component.css']
})
export class InstallationEditComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<string>();
  @Input() installId: number;

  form: FormGroup;
  formContact: FormGroup;
  formChangeContact: FormGroup;
  basic: boolean;
  sizeModal;
  editInstall = {} as Install;

  dataContacts = [];

  openChengeModal = false;
  changeContact: any;

  constructor(private formBuilder: FormBuilder, private installServices: InstallsService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getInstall();
    this.getContacts();
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

  submit(): void {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.editInstall.name = x.name.name;
    this.editInstall.firstName = x.name.firstName;
    this.editInstall.lastName = x.name.lastName;
    this.editInstall.email = x.contact.email;
    this.editInstall.phone = x.contact.phone;
    this.editInstall.street = x.adress.street;
    this.editInstall.number = x.adress.number;
    this.editInstall.postalCode = x.adress.postalCode;
    this.editInstall.city = x.adress.postalCode;

    this.installServices.updateInstall(this.editInstall).subscribe(() => {
      this.basic = false;
      this.toastr.success('Zaktualizowano dane montażu');
      this.newItemEvent.emit('true');
    },
      error => {
        this.basic = false;
        this.toastr.error('Błąd aktalizacji danych montażu');
        this.newItemEvent.emit('err');
      });
    }

  close(): void {
    this.basic = false;
    this.newItemEvent.emit('false');
  }

  getInstall(): void {
    this.installServices.getInstall(this.installId).subscribe((data) => {
      this.editInstall = data;
      this.form = this.formBuilder.group({
        name: this.formBuilder.group({
          firstName: [this.editInstall.firstName],
          lastName: [this.editInstall.lastName],
          name: [this.editInstall.name, Validators.required],
        }),
        contact: this.formBuilder.group({
          email: [this.editInstall.email],
          phone: [this.editInstall.phone],
        }),
        adress: this.formBuilder.group({
          street: [this.editInstall.street],
          number: [this.editInstall.number],
          postalCode: [this.editInstall.postalCode],
          city: [this.editInstall.city],
        }),
      });
    });
  }

  getContacts(): void {
    this.installServices.getAllContacts(this.installId).subscribe((data) => {
      this.dataContacts = data;
    });
  }

  submitContact(): void {
    const x = JSON.parse(JSON.stringify(this.formContact.value));
    this.installServices.addContact(this.installId, x.name, x.phone, x.email).subscribe(() => {
      this.getContacts();
      this.formContact.reset();
    });
  }

  deactivateContact(id: number): void {
    this.installServices.deactivateContact(id).subscribe(() => {
      this.getContacts();
    });
  }

  submitChange(): void {
    const x = JSON.parse(JSON.stringify(this.formChangeContact.value));
    this.installServices.updateContact(this.changeContact.id, this.changeContact.installId, x.name, x.phone, x.email).subscribe(() => {
      this.openChengeModal = false;
      this.getContacts();
    });
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

}
