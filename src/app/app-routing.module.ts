import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { LogoutComponent } from './components/authentication/logout/logout.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { MembersComponent } from './components/dashboard/members/members.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/forgot-password.component';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './components/dashboard/page-not-found/page-not-found.component';
import { ResetPasswordConfirmComponent } from './components/authentication/reset-password-confirm/password-reset.component';
import { RegisterConfirmComponent } from './components/authentication/register-confirm/register-confirm.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { UsersComponent } from './components/admin/users/users.component';
import { ChangePasswordComponent } from './components/authentication/change-password/change-password.component';
import { NotificationComponent } from './components/dashboard/notification/notification.component';
import { ProjectInstanceComponent } from './components/dashboard/project-instance/project-instance.component';
import { ArchivedProjectsComponent } from './components/dashboard/archived-projects/archived-projects.component';
import { ProjectSettingsComponent } from './components/dashboard/project-settings/project-settings.component';
import { InvoiceInstanceComponent } from './components/dashboard/invoice-instance/invoice-instance.component';
import { ArchivedInvoicesComponent } from './components/dashboard/archived-invoices/archived-invoices.component';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { InvoiceFilesComponent } from './components/dashboard/invoice-files/invoice-files.component';
import { TimelineComponent } from './components/dashboard/timeline/timeline.component';
import { LicencesComponent } from './components/admin/licences/licences.component';
import { PurchaseLicenceComponent } from './components/dashboard/purchase-licence/purchase-licence.component'
import { EnterpriseLicencesComponent } from './components/admin/enterprise-licences/enterprise-licences.component';
import { LicenceHistoryComponent } from './components/dashboard/licence-history/licence-history.component';
import { DiscountCouponComponent } from './components/admin/discount-coupon/discount-coupon.component';
import { AdminProfileComponent } from 'src/app/components/admin/admin-profile/admin-profile.component';
import { DisputesTimelineComponent } from './components/dashboard/disputes-timeline/disputes-timeline.component';
import { DisputeFilesComponent } from './components/dashboard/dispute-files/dispute-files.component';
import { ArchivedClaimsComponent } from './components/dashboard/archived-claims/archived-claims.component';
import { TimelineHistoryComponent } from './components/dashboard/timeline-history/timeline-history.component';
import { HelpGuideComponent } from './components/dashboard/help-guide/help-guide.component';
import { PaymentProcessComponent } from './components/dashboard/payment-process/payment-process.component';
import { PrjectDaysviewComponent } from './components/dashboard/prject-daysview/prject-daysview.component';
import { AdminLicenseHistoryComponent } from './components/admin/admin-license-history/admin-license-history.component'
import { PaymentInvoiceComponent } from './components/dashboard/payment-invoice/payment-invoice.component';
import { AdminPaymentinvoiceComponent } from './components/admin/admin-paymentinvoice/admin-paymentinvoice.component';
import { AdmiListpaymentinvoicesComponent } from './components/admin/admi-listpaymentinvoices/admi-listpaymentinvoices.component';
import { TemporaryPaymentlistComponent } from './components/admin/temporary-paymentlist/temporary-paymentlist.component';



const dashboardRoutes: Routes = [
    { path: '', redirectTo: 'projects', pathMatch: 'full' },
    { path: 'deadlines', component: PrjectDaysviewComponent, data: { title: 'Monthly Enterprise Deadlines' } },
    { path: 'projects', component: DashboardComponent, data: { title: 'Projects' } },
    { path: 'projects/:id', component: ProjectInstanceComponent, data: {title: 'Project Overview'} },
    { path: 'projects/settings/:id', component: ProjectSettingsComponent, data: { title: 'Notification Settings' } },
    // { path: 'projects/invoices/invoice', component: InvoiceInstanceComponent },
    { path: 'projects/invoices/invoice', component: TimelineComponent, data: { title: 'Invoice Timeline' } },
    { path: 'archived', component: ArchivedProjectsComponent, data: { title: 'Archived Projects' } },
    { path: 'archived-invoices/:projectid', component: ArchivedInvoicesComponent, data: { title: 'Archived Invoices' } },
    { path: 'archived-claims/:projectid', component: ArchivedClaimsComponent, data: { title: 'Archived Claims' } },
    { path: 'members', component: MembersComponent, data: { title: 'Users' } },
    { path: 'notifications', component: NotificationComponent, data: { title: 'Notifications' } },
    { path: 'change-password', component: ChangePasswordComponent, data: { title: 'Change Password' } },
    { path: 'profile', component: ProfileComponent, data: { title: 'Profile' } },
    { path: 'invoice-files', component: InvoiceFilesComponent, data: { title: 'Invoice Files' } },
    { path: 'dispute-files', component: DisputeFilesComponent, data: { title: 'Claim Files' } },
    { path: 'purchase-licence', component: PurchaseLicenceComponent, data: { title: 'Licenses' } },
    { path: 'licence-history', component: LicenceHistoryComponent, data: { title: 'License History' } },
    { path: 'projects/disputes/dispute', component: DisputesTimelineComponent, data: { title: 'Claim Timeline' } },
    { path: 'projects/invoices/invoice-history', component: TimelineHistoryComponent, data: { title: 'Invoice History' } },
    { path: 'projects/disputes/dispute-history', component: TimelineHistoryComponent, data: { title: 'Claim History' } },
    { path: 'help-guide', component: HelpGuideComponent, data: { title: 'Help Guide' } },
    { path: 'payment-invoice', component: PaymentInvoiceComponent, data: { title: 'Payment Invoice' } },
];

const adminRoutes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'users', component: UsersComponent, data: { title: 'Users' } },
    { path: 'change-password', component: ChangePasswordComponent, data: { title: 'Change Password' } },
    { path: 'notifications', component: NotificationComponent, data: { title: 'Notifications' } },
    { path: 'profile', component: AdminProfileComponent, data: { title: 'Profile' } },
    { path: 'licences', component: LicencesComponent, data: { title: 'Licenses' } },
    { path: 'enterprise-licences', component: EnterpriseLicencesComponent, data: { title: 'Enterprice Licences' } },
    { path: 'discount-coupon', component: DiscountCouponComponent, data: { title: 'Discount Coupons' } },
    { path: 'license-history', component: AdminLicenseHistoryComponent, data: { title: 'Admin License History' } },
    { path: 'payment-invoice', component: AdminPaymentinvoiceComponent, data: { title: 'Payment Invoice' } },
    { path: 'payment-invoicehistroy', component: AdmiListpaymentinvoicesComponent, data: { title: 'Payment Invoice History' } },
    { path: 'temppayment-invoicehistroy', component: TemporaryPaymentlistComponent, data: { title: 'Temporary Payment Invoice History' } }
    
];

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, data: { title: 'PPAT - Login' }  },
    { path: 'register', component: RegisterComponent, data: { title: 'PPAST - Register' }  },
    { path: 'register-confirm', component: RegisterConfirmComponent, data: { title: 'Confirm Registration' }  },
    { path: 'logout', component: LogoutComponent, data: { title: 'Logout' }  },
    { path: 'reset-password', component: ResetPasswordComponent, data: { title: 'Reset Password' }  },
    { path: 'reset-password-confirm', component: ResetPasswordConfirmComponent, data: { title: 'Confirm Reset Password' }  },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: dashboardRoutes },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard], children: adminRoutes },
    { path: '404', component: PageNotFoundComponent, data: { title: 'Page Not Found' }  },
    { path: 'payment-process', component: PaymentProcessComponent, data: { title: 'Payment Processing' } },
    { path: '**', redirectTo: '404' },
    
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
