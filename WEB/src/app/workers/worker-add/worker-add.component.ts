import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../Models/user';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-worker-add',
  templateUrl: './worker-add.component.html',
  styleUrls: ['./worker-add.component.css']
})
export class WorkerAddComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<string>();

  form: FormGroup;
  basic: boolean;
  sizeModal;
  newUser = {} as User;
  isAdmin = false;
  isKierownik = false;
  isSMS = false;
  checkNumber = false;

  constructor(private formBuilder: FormBuilder, private user: UsersService, private toastr: ToastrService) {
    this.basic = true;
    this.sizeModal = 'lg';
    this.form = this.formBuilder.group({
      name: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        login: ['', Validators.required]
      }),
      contact: this.formBuilder.group({
        email: [],
        phone: ['', Validators.pattern('(?=.*[0-9])[+48]{3}[0-9]{9}')],
      }),
      password: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm: ['', Validators.required],
      }, {
        validator: MustMatch('password', 'confirm')
      }),
      workRate: this.formBuilder.group({
        rateStd: ['', Validators.required],
        overStd: ['', Validators.required],
        rateStdHoliday: ['', Validators.required],
        overStdHoliday: ['', Validators.required],
        rateAlterHoliday: ['', Validators.required],
        overAlterHoliday: ['', Validators.required],
        rateAlter: ['', Validators.required],
        overAlter: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
  }

  submit(): void {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.newUser.login = x.name.login;
    this.newUser.password = x.password.password;
    if (this.isAdmin) {
      this.newUser.isAdmin = 10;
    }
    else if (this.isKierownik) {
      this.newUser.isAdmin = 8;
    }
    else {
      this.newUser.isAdmin = 0;
    }
    if (this.isSMS) {
      this.newUser.notificationsSMS = 1;
    }
    else {
      this.newUser.notificationsSMS = 0;
    }
    this.newUser.active = 1;
    this.newUser.firstName = x.name.firstName;
    this.newUser.lastName = x.name.lastName;
    this.newUser.email = x.contact.email;
    this.newUser.phone = x.contact.phone;
    this.user.addUser(this.newUser).subscribe((data) => {
      this.user.addUserRateWork(
        data,
        x.workRate.rateStd,
        x.workRate.rateAlter,
        x.workRate.rateStdHoliday,
        x.workRate.rateAlterHoliday,
        x.workRate.overStd,
        x.workRate.overStdHoliday,
        x.workRate.overAlter,
        x.workRate.overAlterHoliday).subscribe(() => {
        this.basic = false;
        this.toastr.success('Dodano nowego użytkownika');
        this.newItemEvent.emit('true');
      });
    },
      error => {
        this.basic = false;
        this.toastr.error('Błąd dodania nowego użytkownika');
        this.newItemEvent.emit('err');
      });
  }

  close(): void {
    this.basic = false;
    this.newItemEvent.emit('false');
  }

  isAdminChenge(): void {
    this.isAdmin = !this.isAdmin;
    this.isKierownik = false;
  }

  isKierownikChenge(): void {
    this.isKierownik = !this.isKierownik;
    this.isAdmin = false;
  }

  isSMSChenge(): void {
    this.isSMS = !this.isSMS;
  }

  validator(): void {
    if (this.form.get('contact.phone').valid) {
      this.checkNumber = true;
    }
    else {
      this.checkNumber = false;
    }
  }

}

export function MustMatch(controlName: string, matchingControlName: string): any {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
