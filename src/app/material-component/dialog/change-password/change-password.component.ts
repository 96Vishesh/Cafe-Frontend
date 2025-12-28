import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    changePasswordForm: any = FormGroup;
    hideOld: boolean = true;
    hideNew: boolean = true;
    hideConfirm: boolean = true;
    responseMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private snackbarService: SnackbarService,
        public dialogRef: MatDialogRef<ChangePasswordComponent>
    ) { }

    ngOnInit(): void {
        this.changePasswordForm = this.fb.group({
            oldPassword: [null, Validators.required],
            newPassword: [null, Validators.required],
            confirmPassword: [null, Validators.required]
        });
    }

    validateSubmit() {
        if (this.changePasswordForm.value.newPassword !== this.changePasswordForm.value.confirmPassword) {
            return true;
        }
        return false;
    }

    onSubmit() {
        if (this.validateSubmit()) {
            this.snackbarService.openSnackBar('New password and confirm password do not match', GlobalConstants.error);
            return;
        }

        const formData = {
            oldPassword: this.changePasswordForm.value.oldPassword,
            newPassword: this.changePasswordForm.value.newPassword,
            confirmPassword: this.changePasswordForm.value.confirmPassword
        };

        this.userService.changePassword(formData).subscribe(
            (response: any) => {
                this.dialogRef.close();
                this.snackbarService.openSnackBar('Password Changed Successfully', 'success');
            },
            (error: any) => {
                console.error(error);
                if (error.error?.message) {
                    this.responseMessage = error.error?.message;
                } else {
                    this.responseMessage = GlobalConstants.genericError;
                }
                this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
            }
        );
    }
}
