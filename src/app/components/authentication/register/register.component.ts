import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { passwordComparison, showPasswordHelper } from 'src/app/models/common.model';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerFormGroup: FormGroup;
    registerFormGroupValid: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private notify: NotificationService,
        private router: Router,
        private renderer: Renderer2
    ) {
        this.registerFormGroup = this.formBuilder.group({
            company_name: ['', Validators.required],
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            postal_code: ['', Validators.compose([
                Validators.required, Validators.maxLength(10)
            ])],
            province: ['', Validators.required],
            country: ['', Validators.required],
            phone_number: ['', Validators.compose([
                Validators.required, Validators.maxLength(16)
            ])],
            email: ['', Validators.compose([
                Validators.pattern(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/), Validators.required,
            ])],
            password1: ['', Validators.compose([
                Validators.minLength(8), Validators.required
            ])],
            password2: ['', Validators.required],
            terms: ['', Validators.required],
        }, {
            validator: passwordComparison('password1', 'password2')
        });
    }

    ngOnInit() {
    }

    // register submission
    onRegisterSubmit(formValue: any) {
        if(this.registerFormGroup.status === 'VALID'){
            this.authService.userSignup(formValue).subscribe(res => {
                if (res.email.length) {
                    this.notify.notifySuccess('Please confirm your account by clicking confirmation link. Please check in spam/junk mails', 'Confirmation mail sent!');
                    this.registerFormGroupValid = true;
                    this.router.navigate(['/login']);
                } else {
                    this.notify.notifyError('User registration failed', 'Error occured!'); 
                    this.registerFormGroupValid = true;
                    this.registerFormGroup.reset();
                }
            });
        }else {
            this.registerFormGroupValid = false;
        }
            
    }

    // show/hide password
    showPassword(el) {
        showPasswordHelper(el, this.renderer);
    }

    // show terms & conditions modal
    showTerms() {
        $('#terms-modal').modal('show');
    }

    // toggle form validity on terms click
    termsClick(event) {
        event.checked ? this.registerFormGroup.setErrors(null) : this.registerFormGroup.setErrors({});
    }
}
