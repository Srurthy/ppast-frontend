import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from '../services/notification.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    token : string;
    constructor(
        private ngxLoader: NgxUiLoaderService,
        private notify: NotificationService,
        private authService: AuthenticationService,
        private router: Router,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // setting jwt token
        let clonedRequest = request;
        if (this.authService.isUserAuthenticated() && !(request.url.includes('login') || (request.url.includes('register') || (request.url.includes('reset'))))) {
            clonedRequest = request.clone({
                headers: request.headers.set('Authorization', `JWT ${this.authService.getUserDetails().token}`)
            });
        }
        return next.handle(clonedRequest).pipe(
            // stop loader
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.ngxLoader.stop();
                }
                return event;
            }),
            // catch application wide error responses
            catchError((error: HttpErrorResponse) => {
                this.ngxLoader.stop();
                if (error.error && Object.keys(error.error).length) {
                    const errorMessage = error.error[Object.keys(error.error)[0]].toString();
                    this.notify.notifyError(errorMessage, 'Error!');
                    // if session expired, redirect to login page
                    if (errorMessage.toLowerCase().includes('signature has expired')) {
                        this.router.navigate(['/login']);
                    }
                } else {
                    this.notify.notifyError('Unknown error', 'Error!');
                }
                return throwError(error);
            })
        );
    }
}
