import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    emailFormGroup: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private notify: NotificationService,
        private router: Router
    ) { 
        this.emailFormGroup = this.formBuilder.group({
            'email': ['', Validators.compose([
                Validators.pattern(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/), Validators.required,
            ])],
        });
    }

    ngOnInit() {
    }

    sendResetEmail(formValue: any) {
        this.authService.userResetPasswordToEmail(formValue).subscribe(res => {
            this.notify.notifySuccess('Email is send if you have an account with PPA-Tracker. Please check in spam/junk mails', 'Password reset successful');
            this.router.navigate(['/login']);
        });
    }
}
