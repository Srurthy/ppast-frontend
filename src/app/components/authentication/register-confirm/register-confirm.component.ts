import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-register-confirm',
    templateUrl: './register-confirm.component.html',
    styleUrls: ['./register-confirm.component.css']
})
export class RegisterConfirmComponent implements OnInit {
    uid: string;
    token: string;

    constructor(
        private router: Router,
        private notify: NotificationService,
        private activatedRoute: ActivatedRoute,
        private authService: AuthenticationService
    ) { }

    ngOnInit() {
        // get uid & token
        this.activatedRoute.queryParams.subscribe(params => {
            this.uid = params.uid;
            this.token = params.token;
        });
    }

    // confirm account registration
    confirmAccount() {
        const params = {
            uid: this.uid,
            token: this.token
        }
        this.authService.userAccountConfirmation(params).subscribe(res => {
            this.notify.notifySuccess('', 'Account confirmed');
            this.router.navigate(['/login']);
        });
    }
}
