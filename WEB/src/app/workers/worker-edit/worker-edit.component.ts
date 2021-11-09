import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../Models/user';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-worker-edit',
  templateUrl: './worker-edit.component.html',
  styleUrls: ['./worker-edit.component.css']
})
export class WorkerEditComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<string>();
  @Input() userId: number;

  form: FormGroup;
  basic: boolean;
  sizeModal;
  editUser = {} as User;
  isAdmin = false;
  isKierownik = false;
  isSMS = false;
  checkNumber = false;

  constructor(private formBuilder: FormBuilder, private user: UsersService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getUser();
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

  submit(): void {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.editUser.login = x.name.login;
    this.editUser.firstName = x.name.firstName;
    this.editUser.lastName = x.name.lastName;
    this.editUser.email = x.contact.email;
    this.editUser.phone = x.contact.phone;
    if (this.isAdmin) {
      this.editUser.isAdmin = 10;
    }
    else if (this.isKierownik) {
      this.editUser.isAdmin = 8;
    }
    else {
      this.editUser.isAdmin = 0;
    }
    if (this.isSMS) {
      this.editUser.notificationsSMS = 1;
    }
    else {
      this.editUser.notificationsSMS = 0;
    }
    this.user.updateUser(this.editUser).subscribe(() => {
      this.updateUserRate();
      this.basic = false;
      this.toastr.success('Zaaktualizowano');
      this.newItemEvent.emit('true');
    },
      error => {
        this.basic = false;
        this.toastr.error('Błąd aktualizacji');
        this.newItemEvent.emit('err');
      });
  }

  close(): void {
    this.basic = false;
    this.newItemEvent.emit('false');
  }

  updateUserRate(): void {
    const x = JSON.parse(JSON.stringify(this.form.value));
    this.user.updateUserRateWork(
      this.userId,
      x.workRate.rateStd,
      x.workRate.rateAlter,
      x.workRate.rateStdHoliday,
      x.workRate.rateAlterHoliday,
      x.workRate.overStd,
      x.workRate.overStdHoliday,
      x.workRate.overAlter,
      x.workRate.overAlterHoliday).subscribe(() => {

    });
  }

  getUser(): void {
    this.user.getUser(this.userId).subscribe((data) => {
      this.editUser = data;
      if (this.editUser.isAdmin === 10) {
        this.isAdmin = true;
      }
      else if (this.editUser.isAdmin === 8) {
        this.isKierownik = true;
      }
      if (this.editUser.notificationsSMS === 1) {
        this.isSMS = true;
      }
      this.user.getUserRateWork(this.userId).subscribe((rate) => {
        this.form = this.formBuilder.group({
          name: this.formBuilder.group({
            firstName: [this.editUser.firstName, Validators.required],
            lastName: [this.editUser.lastName, Validators.required],
            login: [this.editUser.login, Validators.required]
          }),
          contact: this.formBuilder.group({
            email: [this.editUser.email],
            phone: [this.editUser.phone, Validators.pattern('(?=.*[0-9])[+48]{3}[0-9]{9}')],
          }),
          workRate: this.formBuilder.group({
            rateStd: [rate.rateStd, Validators.required],
            overStd: [rate.overtimeStd, Validators.required],
            rateStdHoliday: [rate.rateStdHoliday, Validators.required],
            overStdHoliday: [rate.overtimeStdHoliday , Validators.required],
            rateAlterHoliday: [rate.rateAlterHoliday, Validators.required],
            overAlterHoliday: [rate.overtimeAlterHoliday, Validators.required],
            rateAlter: [rate.rateAlter, Validators.required],
            overAlter: [rate.overtimeAlter, Validators.required],
          }),
        });
      });
    });
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

