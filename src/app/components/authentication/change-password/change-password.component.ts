import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordComparison } from 'src/app/models/common.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    changeFormGroup: FormGroup;
    changeFormGroupValid: boolean;
    sameCredentials: boolean;
    adminStatus: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private router: Router,
        private notify: NotificationService
    ) {
        this.changeFormGroup = this.formBuilder.group({
            old_password: ['', Validators.compose([
                Validators.minLength(8), 
                Validators.required
            ])],
            new_password1: ['', Validators.compose([
                Validators.minLength(8), 
                Validators.required
            ])],
            new_password2: ['', Validators.compose([
                Validators.required
            ])],
        });
        this.changeFormGroup.setValidators(passwordComparison('new_password1', 'new_password2'));
    }

    ngOnInit() {
        this.router.url.includes('admin') ? this.adminStatus = true : this.adminStatus = false;
    }

    // compare old & new passwords
    compareOldPassword(input) {
        const oldPassword = this.changeFormGroup.get('old_password').value;
        if (input.target.value === oldPassword) {
            this.sameCredentials = true;
            this.changeFormGroup.setErrors({ 'invalid': true });
        } else {
            this.sameCredentials = false;
            this.changeFormGroup.setErrors(null);
        }
    }

    // confirm reset password
    changePassword(formValue: any) {
        if(this.changeFormGroup.status === 'VALID'){
            this.authService.changeUserPassword(formValue).subscribe(res => {
                this.notify.notifySuccess('Use new credentials to login', 'Password changed');
                this.changeFormGroupValid = true;
                this.router.navigate(['/login']);
            });
        }else {
            this.changeFormGroupValid = false;
        }
        
    }
}
