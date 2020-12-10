import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IUserDetails } from '../models/common.model';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    API_URL: string;
    headerName$: Subject<string>;
    
    constructor(private http: HttpClient, private permissionService: NgxPermissionsService) { 
        this.API_URL = environment.apiUrl;
        this.headerName$ = new Subject<string>();
    }

    // get user messages to validate purchase
    getDjangoMessage() {
        return this.http.get(`${this.API_URL}/converge/get_user_messages/`);
    }

    // send reset password link to email {email}
    userResetPasswordToEmail(formValue: any): Observable<any> {
        return this.http.post(`${this.API_URL}/account/password/reset/`, formValue);
    }

    // reset user password confirmation {new_password1, new_password2, uid, token}
    userResetPassword(updatedParams: any): Observable<any> {
        return this.http.post(`${this.API_URL}/account/password/reset/confirm/`, updatedParams);
    }

    // change password {old_password, new_password1, new_password2}
    changeUserPassword(formValue: any): Observable<any> {
        return this.http.post(`${this.API_URL}/account/password/change/`, formValue);
    }

    // user signup/registration
    userSignup(formValue: any): Observable<any> {
        const updatedParams = {...formValue, username: formValue.email};
        return this.http.post(`${this.API_URL}/account/register/`, updatedParams);
    }

    // registration confirmation {uid, token}
    userAccountConfirmation(params: any): Observable<any> {
        return this.http.post(`${this.API_URL}/account/register/confirm/`, params);
    }

    // user login 
    userLogin(formValue: any): Observable<any> {
        const loginParams: any = {
            password: formValue.password
        }
        formValue.username_email.includes('@') ? loginParams.email = formValue.username_email : loginParams.username = formValue.username_email;
        return this.http.post(`${this.API_URL}/account/login/`, loginParams);
    }

    // logged in 
    userLoggedIn(userDetails: IUserDetails) {
        // role can be ENTERPRISE_ADMIN, ENTERPRISE_MEMBER, USER
        if(userDetails['user']['is_enterprise_admin'] === true) {
            userDetails['user']['role'] = 'ENTERPRISE_ADMIN';
        } else if (userDetails['user']['is_enterprise_member'] === true) {
            userDetails['user']['role'] = 'ENTERPRISE_MEMBER';
        } else {
            userDetails['user']['role'] = 'USER';
        }
        userDetails['user']['active_licence'] = false;
        if (localStorage.getItem('rememberMe') != undefined) {
            localStorage.setItem('user', JSON.stringify(userDetails));
        }
        else {
            localStorage.setItem('user', JSON.stringify(userDetails));
        }
    }

    // get user details
    getUserDetails(): IUserDetails {
        let details;
        if (localStorage.getItem('rememberMe') != undefined)  details = JSON.parse(localStorage.getItem('user'));
        else details = JSON.parse(localStorage.getItem('user'));
        this.permissionService.loadPermissions([details['user']['role']]);
        if(details['user']['role'] == 'ENTERPRISE_MEMBER' && details['user']['project_role']) this.permissionService.addPermission([details['user']['project_role']]);
        if(details['user']['active_licence'] || details['user']['role'] == 'ENTERPRISE_MEMBER') this.permissionService.addPermission(['ACTIVE_LICENCE']);
        const { token, user: { id: uid, email, first_name, last_name, is_staff, role, company_name, address, phone_number, postal_code, city, country, province }, credential } = details;
        const screen_name = `${first_name.slice(0, 1).toUpperCase() + first_name.slice(1)} ${last_name.slice(0, 1).toUpperCase() + last_name.slice(1)}`;
        return { uid, token, email, first_name, last_name, screen_name, credential, is_staff, role, company_name, address, phone_number, postal_code, city, country, province };
    }
    

    // check if user is authenticated
    isUserAuthenticated(): boolean {
        return localStorage.getItem('rememberMe') != undefined 
            ? localStorage.getItem('user') != null
            : localStorage.getItem('user') != null;
    }

    // logout
    userLogout() {
        if (localStorage.getItem('rememberMe') == undefined) {
            localStorage.removeItem('user');
            sessionStorage.removeItem('first_login');
            localStorage.clear();
        }
    }

    // remember me
    rememberMe(value: boolean) {
        if (value) {
            localStorage.setItem('rememberMe', 'true');
            sessionStorage.removeItem('rememberMe');
        } else {
            sessionStorage.setItem('rememberMe', 'false');
            localStorage.removeItem('rememberMe');
        }
    }
    
    // updating user role to ENTERPRISE_ADMIN from USER on purchase of enterprise licence
    UpdateUserRole(){
        let details = this.getDetails();
        if(details['user']['role'] == 'USER'){
            details['user']['role'] = 'ENTERPRISE_ADMIN';
            details['user']['is_enterprise_admin'] = true;
            this.permissionService.removePermission('USER');
            this.permissionService.addPermission('ENTERPRISE_ADMIN');
            this.setDetails(details);
        }
    }

    // update user firstname and last name in while profile update
    updateUserData(first_name, last_name){
        let details = this.getDetails();
        details['user']['first_name'] = first_name;
        details['user']['last_name'] = last_name;
        this.setDetails(details);
    }


    // update licence status if active licence exist
    updateLicenceState(){
        let details = this.getDetails();
        details['user']['active_licence'] = true;
        this.permissionService.addPermission('ACTIVE_LICENCE');
        this.setDetails(details);
    }

    // update Project Role in case of enterprise member login
    updateProjectRole(role){
        let details = this.getDetails();
        if(details['user']['project_role']) this.permissionService.removePermission(details['user']['project_role']);
        details['user']['project_role'] = role;
        this.permissionService.addPermission(role);
        this.setDetails(details);
    }

    getDetails(){
        if (localStorage.getItem('rememberMe') != undefined) {
            return(JSON.parse(localStorage.getItem('user')));
        } else {
            return(JSON.parse(localStorage.getItem('user')));
        }
    }

    setDetails(details){
        localStorage.removeItem('user');
        localStorage.removeItem('user');
        if (localStorage.getItem('rememberMe') != undefined) { localStorage.setItem('user', JSON.stringify(details) );}
        else{ localStorage.setItem('user', JSON.stringify(details)); }
    }
}
