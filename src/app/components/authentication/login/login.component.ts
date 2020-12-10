import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { showPasswordHelper, IUserDetails } from 'src/app/models/common.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginFormGroup: FormGroup;
    loginFormGroupValid: boolean;
    @ViewChild('remember', { static: true }) remember: ElementRef;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private notify: NotificationService,
        private router: Router,
        private renderer: Renderer2
    ) {
        this.loginFormGroup = this.formBuilder.group({
            username_email: ['', Validators.compose([
                Validators.pattern(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/), Validators.required, 
            ])],
            password: ['', Validators.compose([
                Validators.minLength(4), Validators.required
            ])]
        });
    }

    ngOnInit() {
        // logout user
        // this.authService.userLogout();
        // remember username & password
        $('.ie-incompatible').hide();
        if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
            $('.ie-incompatible').show();
        }
        if(localStorage.getItem('rememberMe') != undefined) {
            this.loginFormGroup.patchValue({
                username_email: this.authService.getUserDetails().email,
                password: this.authService.getUserDetails().credential
            });
            this.remember.nativeElement.checked = true;
        }
    }

    // login submission
    loginSubmit(formValue: any) {
        if(this.loginFormGroup.status === 'VALID') {
            this.authService.userLogin(formValue).subscribe(res => {
                if (res.token && res.token.length) {
                    const userCredentials: IUserDetails = {
                        ...res,
                        credential: formValue.password
                    }
                    this.authService.userLoggedIn(userCredentials);
                    // redirect to admin or user
                    res.user.is_staff ? this.router.navigate(['/admin']) : this.router.navigate(['/home']);
                } else {
                    this.notify.notifyError('Username or password incorrect', 'Login failed');
                    this.loginFormGroupValid = true;
                    this.loginFormGroup.reset();
                }
            });
        } else {
            this.loginFormGroupValid = false;
        }
        
    }

    // remember me
    setRememberMe(el: any) {
        this.authService.rememberMe(el.checked);
    }

    // show/hide password
    showPassword(el) {
        showPasswordHelper(el, this.renderer);
    }
}
