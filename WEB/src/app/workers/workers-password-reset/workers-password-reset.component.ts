import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../Models/user';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-workers-password-reset',
  templateUrl: './workers-password-reset.component.html',
  styleUrls: ['./workers-password-reset.component.css']
})
export class WorkersPasswordResetComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<string>();
  @Input() userId: number;

  form: FormGroup;
  basic: boolean;
  sizeModal;
  newUser = {} as User;

  constructor(private formBuilder: FormBuilder, private user: UsersService, private toastr: ToastrService) {
    this.basic = true;
    this.sizeModal = 'lg';
    this.form = this.formBuilder.group({
      password: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm: ['', Validators.required],
      }, {
        validator: MustMatch('password', 'confirm')
      }),
    });
  }

  ngOnInit(): void {
  }

  submit(): void {
    const x = JSON.parse(JSON.stringify(this.form.value));

    this.newUser.id = this.userId;
    this.newUser.password = x.password.password;
    this.user.resetPassword(this.newUser).subscribe(() => {
      this.basic = false;
      this.toastr.success('Zmieniono hasło');
      this.newItemEvent.emit('true');
    },
      error => {
        this.basic = false;
        this.toastr.error('Błąd zmiany hasła');
        this.newItemEvent.emit('err');
      });
  }

  close(): void {
    this.basic = false;
    this.newItemEvent.emit('false');
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
