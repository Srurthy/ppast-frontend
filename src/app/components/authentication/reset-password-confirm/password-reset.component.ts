import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordComparison } from 'src/app/models/common.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.css']
})
export class ResetPasswordConfirmComponent implements OnInit {
    resetFormGroup: FormGroup;
    uid: string;
    token: string;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private router: Router,
        private notify: NotificationService,
        private activatedRoute: ActivatedRoute
    ) { 
        this.resetFormGroup = this.formBuilder.group({
            new_password1: ['', Validators.compose([
                Validators.minLength(8), Validators.required
            ])],
            new_password2: ['', Validators.compose([
                Validators.required
            ])],
        }, {
            validators: passwordComparison('new_password1', 'new_password2')
        });
    }

    ngOnInit() {
        // get uid & token
        this.activatedRoute.queryParams.subscribe(params => {
            this.uid = params.uid;
            this.token = params.token;
        });
    }

    // confirm reset password
    resetPassword(formValue: any) {
        const updatedFormValue = {
            ...formValue,
            uid: this.uid,
            token: this.token
        }
        this.authService.userResetPassword(updatedFormValue).subscribe(res => {
            this.notify.notifySuccess('Use new credentials to login', 'Password reset successful');
            this.router.navigate(['/login']);
        });
    }
}
