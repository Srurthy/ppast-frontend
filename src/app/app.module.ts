import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// ngx-toastr
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
// ngx-ui-loader
import { NgxUiLoaderModule, NgxUiLoaderHttpModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
// angular material
import {
	MatNativeDateModule, MatDatepickerModule, MatInputModule,
    MatSelectModule, MAT_DATE_FORMATS, DateAdapter, MatTabsModule, MatCheckboxModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
} from '@angular/material';
import { APP_DATE_FORMAT } from './models/common.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// calendar
import { CalendarModule, DateAdapter as CalendarDateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// vertical timeline
import { VerticalTimelineModule } from 'angular-vertical-timeline';
// multi select
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// file uploader
import { FileUploadModule } from '@iplab/ngx-file-upload';
// printer
import { NgPrintModule } from 'ng-print';
import {NgxPrintModule} from 'ngx-print';

//toggle button
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { LogoutComponent } from './components/authentication/logout/logout.component';
import { AuthenticationService } from './services/authentication.service';
import { AppHttpInterceptor } from './interceptors/app-http-interceptor';
import { ResetPasswordComponent } from './components/authentication/reset-password/forgot-password.component';
import { ResetPasswordConfirmComponent } from './components/authentication/reset-password-confirm/password-reset.component';
import { RegisterConfirmComponent } from './components/authentication/register-confirm/register-confirm.component';

// ngx-ui-loader config
const httpLoaderConfig = {
	showForeground: true
}
const routerLoaderConfig = {
	showForeground: false
}

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		LogoutComponent,
		ResetPasswordComponent,
		ResetPasswordConfirmComponent,
		RegisterConfirmComponent,
		ChangePasswordComponent
	],
	imports: [
		FormsModule,
		BrowserModule,
		AppRoutingModule,
		ReactiveFormsModule,
		HttpClientModule,
		DataTablesModule,
		NgxPrintModule,
		// ngx-toastr
		CommonModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot({
			timeOut: 5000,
			maxOpened: 3,
			autoDismiss: true,
			positionClass: 'toast-bottom-right',
			preventDuplicates: true,
			newestOnTop: true,
		}),
		NgxUiLoaderModule,
		NgxUiLoaderHttpModule.forRoot(httpLoaderConfig),
		NgxUiLoaderRouterModule.forRoot(routerLoaderConfig),
		MatNativeDateModule,
		MatDatepickerModule,
		MatTabsModule,
		CalendarModule.forRoot({
			provide: CalendarDateAdapter,
			useFactory: adapterFactory
		}),
		NgbModule,
		MatCheckboxModule,
		VerticalTimelineModule,
		MatInputModule,
		NgMultiSelectDropDownModule,
		NgxPermissionsModule.forRoot(),
		FileUploadModule,
		MatExpansionModule,
		MatSlideToggleModule,
		FilterPipeModule,
		MatSelectModule,
        NgPrintModule,
        MatTableModule,
        MatPaginatorModule,
		MatSortModule,
		MatIconModule,
		MatButtonToggleModule,
	],
	providers: [
		AuthenticationService,
		UserService,
		{ provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
		{ provide: DateAdapter, useClass: AppDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMAT },
	],
	bootstrap: [AppComponent],
	entryComponents: [
		ArchiveDialogComponent,
		FolderDialogComponent,
		PlanConfirmComponent,
		UnassignConfirmComponent,
		DetailsDialogComponent,
		EditDialogComponent,
		ArchivedSelectionComponent,
		DeleteConfirmComponent,
		ConfirmDialogComponent,
		CommentDialogComponent,
		DeleteFolderConfirmComponent,
        DeleteFileConfirmComponent,
        UserAssignedProjectsComponent,
        FalseDeleteDialogComponent,
        YoutubeDialogComponent,
	]
})
export class AppModule { }