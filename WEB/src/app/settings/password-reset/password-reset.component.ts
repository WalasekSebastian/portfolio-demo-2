import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private user: UsersService, private toastr: ToastrService) {
    this.form = this.formBuilder.group({
      oldpassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirm')
    });
  }

  ngOnInit(): void {
  }

  submit(): void {
    const x = JSON.parse(JSON.stringify(this.form.value));

    this.user.selfResetPassword(x.oldpassword, x.password).subscribe(() => {
      this.toastr.success('Hasło zmienione');
      this.form.reset();
    },
      error => {
        this.toastr.error('Błąd zmiany hasła');
      });
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
