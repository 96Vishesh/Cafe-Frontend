import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {SnackbarService} from '../services/snackbar.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NgxUiLoaderModule, NgxUiLoaderService} from 'ngx-ui-loader';
import {GlobalConstants} from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder, private router: Router, private userService: UserService,
    private snackbarService: SnackbarService, public dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  password = true;
  confirmPassword = true;
  signupForm: any = FormGroup;
  responseMessage: any;

  protected readonly confirm = confirm;

  ngOnInit(): void {

    this.signupForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
        email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
        contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
        password: [null, [Validators.required]],
        confirmPassword: [null, [Validators.required]]
      });
  }

  // tslint:disable-next-line:typedef
  validateSubmit(){
    // tslint:disable-next-line:triple-equals no-non-null-assertion
    if (this.signupForm.controls.password.value !== this.signupForm.controls.confirmPassword.value){
      return true;
    }else{
      return false;
    }
  }

  // tslint:disable-next-line:typedef
  handleSubmit(){
    this.ngxService.start();
    // tslint:disable-next-line:prefer-const
    var formData = this.signupForm.value;
    // tslint:disable-next-line:prefer-const
    var data = {
      name : formData.name,
      email : formData.email,
      contactNumber : formData.contactNumber,
      password : formData.password
    };

    this.userService.signup(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, '');
      this.router.navigate(['/']);
    }, (error) => {
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }
}
