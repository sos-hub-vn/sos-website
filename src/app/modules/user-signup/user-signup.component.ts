import { RequesterObjectStatusService } from './../../core/http/requester-object-status.service';
import { UsersService } from './../../core/http/users.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.scss'],
})
export class UserSignupComponent implements OnInit {
  @ViewChild('stepper') stepper: any;
  isConfirmed: boolean = false;
  userID: String = '';
  user: IUser = { phone_number: '' };
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  isPhoneInUsed: boolean = false;
  isValidOTP: boolean | undefined;
  seconds: number = 0;
  isCountdown: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private UsersService: UsersService,
    private router: Router,
    public dialogRef: MatDialogRef<UserSignupComponent>
  ) { }

  createForm() {
    this.firstFormGroup = this.formBuilder.group({
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8)]],
    }, {
      validators: this.password.bind(this)
    });
    this.secondFormGroup = this.formBuilder.group({
      confirm_code: ['', Validators.required]
    });
    this.thirdFormGroup = this.formBuilder.group({
      first_name: [''],
      address: [''],
      last_name: ['']
    });
    }
    onClose() {
      this.dialogRef.close();
    }
    password(formGroup: FormGroup) {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirm_password')?.value;
      return password === confirmPassword ? null : { passwordNotMatch: true };
    }
    getError(el: any) {
      switch (el) {
        case 'phone':
          if (this.firstFormGroup.get('phone_number')?.hasError('required')) {
          return 'Yêu cầu nhập số điện thoại';
        }
        if (this.firstFormGroup.get('phone_number')?.hasError('minlength')) {
          return 'Số điện thoại tối thiểu 10 chữ số';
        }
        if (this.isPhoneInUsed) return "Số điện thoại đã được sử dụng";
        return "";
        break;
      case 'password':
        if (this.firstFormGroup.get('password')?.hasError('required')) {
          return 'Yêu cầu nhập mật khẩu';
        }
        if (this.firstFormGroup.get('password')?.hasError('minlength')) {
          return 'Mật khẩu phải chứa tối thiểu 8 kí tự';
        }
        return '';
        break;
      case 'confirm_password':
        if (this.firstFormGroup.get('confirm_password')?.hasError('required')) {
          return 'Yêu cầu nhập lại mật khẩu xác thực';
        }
        if (this.firstFormGroup.get('confirm_password')?.hasError('minlength')) {
          return 'Mật khẩu xác thực phải chứa tối thiểu 8 kí tự';
        }
        if (this.firstFormGroup.get('confirm_password')?.value != this.firstFormGroup.get('password')?.value) {
          return 'Mật khẩu xác thực không trùng khớp';
        }
        return '';
        break;
      case 'confirm_code':
        if (this.secondFormGroup.get('confirm_code')?.hasError('required')) {
          return 'Yêu cầu nhập mã xác nhận';
        }
        return '';
        break;
      default:
        return '';
    }
  }

  AccountSetupSubmit(user: IUser) {
  

    this.UsersService.create({ phone_number: user.phone_number, password: user.password, debug: "true" }, {}).subscribe(
      (result) => {
        console.log(result);
        this.user.phone_number = result.phone_number;
        this.stepper.next();

      },
      error => { this.isPhoneInUsed = true; }
    );
  }
  onResend() {
    this.seconds = 60;
    const timer = setInterval(() => {
      this.seconds--;
      console.log(this.seconds);
      if (this.seconds === 0) {
        clearInterval(timer);
        this.isCountdown = false;
      };
    },1000);
    this.UsersService.resendCode(this.user!, {}).subscribe(
      (result) => {
        console.log(result);
      },
      error => { console.log(error); }
    );
  }
  onConfirm(event: any, user: IUser) {
    console.log(user);
    this.user!.confirm_code = user.confirm_code;
    this.UsersService.confirm(this.user!, {}).subscribe(
      (result) => {
        this.user = result;
        console.log(this.user);
        this.isValidOTP = true;
        this.stepper.next()
      },
      error => { this.isValidOTP = false; }
    );
  }
  finished(userInfo: IUser) {
    userInfo.phone_number = this.user.phone_number;

    this.UsersService.updateProfile(userInfo, {}).subscribe(
      (result) => {
        this.user = result;
        console.log(this.user);
      },
      error => { console.log(error); }
    );
    console.log(this.user);
    this.router.navigateByUrl('/home');
  }
  ngOnInit(): void {

    this.createForm();
  }
}
function MustMatch(arg0: string, arg1: string): any {
  throw new Error('Function not implemented.');
}

