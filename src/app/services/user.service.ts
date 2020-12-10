import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject, forkJoin } from 'rxjs';
import { IProject, IProjectSettings, IInvoice, IInvoiceTimeline, IUserDetails } from '../models/common.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    API_URL: string;
    headerNotificationCount$: Subject<any>;
    refreshInvoice$: Subject<any>;
    refreshClaims$: Subject<any>;
    refreshArchivedInvoices$: Subject<any>;
    refreshArchivedClaims$: Subject<any>;
    headerPageTitle$: Subject<any>;

    constructor(
        private http: HttpClient
    ) {
        this.API_URL = environment.apiUrl;
        this.headerNotificationCount$ = new Subject<any>();
        this.refreshInvoice$ = new Subject<any>();
        this.refreshClaims$ = new Subject<any>();
        this.refreshArchivedInvoices$ = new Subject<any>();
        this.refreshArchivedClaims$ = new Subject<any>();
        this.headerPageTitle$ = new Subject<any>();
    }


    /* PROJECTS */
    // get all project details
    getAllProjects(): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/view_all_projects/`);
    }

    // post projects
    createProjects(formValue): Observable<any> {
        return this.http.post(`${this.API_URL}/projects/`, formValue);
    }

    // update projects
    updateProjectDetails(projectId, formValue): Observable<any> {
        return this.http.patch(`${this.API_URL}/projects/${projectId}/`, formValue);
    }

    // get projects
    getProjects(): Observable<IProject[]> {
        return this.http.get<IProject[]>(`${this.API_URL}/projects/`);
    }

    // get project instance
    getProjectInstance(projectId: string): Observable<IProject> {
        return this.http.get<IProject>(`${this.API_URL}/projects/${projectId}`);
    }

    // archive project
    archiveProject(projectId: string): Observable<any> {
        return this.http.patch(`${this.API_URL}/projects/${projectId}/archive/`, { is_archived: true });
    }

    // get archived projects 
    getArchivedProjects(): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/archived/`);
    }

    // get project settings
    getInvoiceSettings(projectId: string): Observable<IProjectSettings[]> {
        return this.http.get<IProjectSettings[]>(`${this.API_URL}/projects/${projectId}/settings/`);
    }

    // update project settings
    updateProjectSettings(projectId, params): Observable<any> {
        return this.http.put(`${this.API_URL}/projects/${projectId}/settings/`, params);
    }

    // add subparties to existing project
    addSubparties(projectId, params): Observable<any> {
        return this.http.patch(`${this.API_URL}/projects/${projectId}/`, params);
    }

    // project calendar
    getProjectCalendarData(projectId: string): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/project_calendar_view/${projectId}/`);
    }


    /* NOTIFICATIONS */
    // get notification count 
    getNotificationCount(): Observable<any> {
        let response1 = this.http.get(`${this.API_URL}/projects/notifications/count`);
        let response2 = this.http.get(`${this.API_URL}/projects/notifications/claims/count`);
        return forkJoin([response1, response2]);
    }

    // get all notifications
    getAllNotifications(): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/notifications/`);
    }


    // mark notification as read
    notificationRead(notificationId: string): Observable<any> {
        return this.http.put(`${this.API_URL}/projects/notifications/${notificationId}/read`, {});
    }


    /* INVOICES */
    // get all invoices
    getInvoices(projectId): Observable<IInvoice[]> {
        return this.http.get<IInvoice[]>(`${this.API_URL}/projects/${projectId}/invoices/`);
    }

    // set status of invoice
    setInvoiceStatus1(projectId, invoiceId, status: string): Observable<any> {
        return this.http.patch(`${this.API_URL}/projects/${projectId}/invoices/${invoiceId}/status/`, { status });
    }

    setInvoiceStatus(projectId, invoiceId, status: string,cb) {
        this.http.patch(`${this.API_URL}/projects/${projectId}/invoices/${invoiceId}/status/`, { status })
            .toPromise()
            .then(res => {
                cb(1,res)
            })
            .catch(err => {
                cb(2,err)
            })
    }

    // create invoices
    createInvoice(projectId, formValue): Observable<any> {
        // remove sub_parties parameter if null
        if (!formValue.sub_parties.length) delete formValue.sub_parties;
        // setup formData for file upload
        const formData = new FormData();
        Object.entries(formValue).map((keyValue: any) => {
            if (keyValue[0] === 'invoice_files' && (keyValue[1] && Array.isArray(keyValue[1]))) {
                keyValue[1].map(el => {
                    formData.append('invoice_files', el);
                });
            } else if (keyValue[0] === 'sub_parties' && keyValue[1]) {
                keyValue[1].map(el => {
                    formData.append('sub_parties', el);
                });
            } else {
                formData.append(keyValue[0], keyValue[1]);
            }
        });
        return this.http.post(`${this.API_URL}/projects/${projectId}/invoices/`, formData);
    }

    // update invoice details
    updateInvoiceDetails(invoiceId, params): Observable<any> {
        return this.http.patch(`${this.API_URL}/projects/invoices/${invoiceId}/update/`, params);
    }

    // archive invoice
    archiveInvoice(projectId, invoiceId): Observable<any> {
        return this.http.put(`${this.API_URL}/projects/${projectId}/invoices/${invoiceId}/`, {});
    }

    // get archived invoices
    getArchivedInvoices(projectId): Observable<IInvoice[]> {
        return this.http.get<IInvoice[]>(`${this.API_URL}/projects/${projectId}/invoices/archived`);
    }

    // archive invoice
    archiveClaim(projectId, claimId): Observable<any> {
        return this.http.put(`${this.API_URL}/projects/${projectId}/archiveclaims/${claimId}`, {});
    }

    // get archived invoices
    getArchivedClaims(projectId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/${projectId}/claim/archived`);
    }

    // get all subparties for a specific project
    getSubparties(invoiceId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/invoices/${invoiceId}/subparty/`);
    }


    /* INVOICE TIMELINE */
    // invoice timeline details
    getInvoiceTimeline(invoiceId: string): Observable<IInvoiceTimeline[]> {
        return this.http.get<IInvoiceTimeline[]>(`${this.API_URL}/projects/invoice/${invoiceId}`);
    }

    // get list of invoice documents 
    getInvoiceTimelineDocuments(invoiceId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/action/${invoiceId}/docs`);
    }

    // add action or post highlighted actions
    postActionOrHighlightsFromTimeline(params, invoiceId): Observable<any> {
        return this.http.post(`${this.API_URL}/projects/invoice/${invoiceId}/`, params);
    }

    // upload invoice timeline document
    uploadInvoiceTimelineDocument(file, actionId): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.API_URL}/projects/action/${actionId}/docs`, formData);
    }

    // get activity schedules
    getActivitySchedules(invoiceId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/activites_schedules/invoice/${invoiceId}/`);
    }

    // set invoice timeline table toggle status
    putTableToggleStatus(invoiceId: string, actionId: string, status: boolean) {
        return this.http.patch(`${this.API_URL}/projects/activites_schedules/invoice/${invoiceId}/${actionId}/update/`, {
            'is_active': status
        });
    }


    /*  MISCELLANEOUS DOCUMENTS FOR INVOICES */
    // upload miscellaneous document
    uploadMiscDocuments(file, invoiceId): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.API_URL}/projects/invoice/${invoiceId}/docs/`, formData);
    }

    // get miscellaneous documents
    getMiscDocuments(invoiceId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/invoice/${invoiceId}/docs/`);
    }

    // get root folders
    getRootFolders(invoiceId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/invoice/${invoiceId}/folders/`);
    }

    // create root folder
    createRootFolder(name, invoiceId): Observable<any> {
        return this.http.post(`${this.API_URL}/projects/invoice/${invoiceId}/folders/`, name);
    }

    // get invoice folder path 
    getInvoiceFolderPath(folderId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/invoice/folderdetails/${folderId}/`);
    }

    // get claims folder path 
    getClaimsFolderPath(folderId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/claims/folderdetails/${folderId}/`);
    }

    // get subfolders
    getSubFolders(invoiceId, folderId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/invoice/${invoiceId}/folders/${folderId}/`);
    }

    // get files in subfolders
    getSubFolderFiles(invoiceId, folderId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/invoice/${invoiceId}/docs/${folderId}/`);
    }

    // create files in subfolders
    uploadSubFolderFile(file, invoiceId, folderId): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.API_URL}/projects/invoice/${invoiceId}/docs/${folderId}/`, formData);
    }

    // create new folder in sub folder
    createFolderInSubFolder(name, invoiceId, folderId): Observable<any> {
        return this.http.post(`${this.API_URL}/projects/invoice/${invoiceId}/folders/${folderId}/`, name);
    }


    /* LICENSING */
    // get plan
    getUserPlans(): Observable<any> {
        return this.http.get(`${this.API_URL}/account/list_user_licenses/`);
    }

    // get plan
    getEnterprisePlans(): Observable<any> {
        return this.http.get(`${this.API_URL}/account/list_enterprise_licenses/`);
    }

    // choose plan
    choosePlan(data): Observable<any> {
        return this.http.post(`${this.API_URL}/licenses/add_licenses/`, data);
    }

    // get enterprise members
    getAllEnterpriseMembers(): Observable<any> {
        return this.http.get(`${this.API_URL}/account/create_enterprise_member/`);
    }

    getEnterpriseMembers(offset, responseLimit): Observable<any> {
        return offset
            ? this.http.get(`${this.API_URL}/account/create_enterprise_member/?offset=${offset * responseLimit}&limit=${responseLimit}`)
            : this.http.get(`${this.API_URL}/account/create_enterprise_member/?limit=${responseLimit}`);
    }

    searchEnterpriseMembers(offset, responseLimit, query): Observable<any> {
        return offset
            ? this.http.get(`${this.API_URL}/account/create_enterprise_member/?search=${query}&offset=${offset * responseLimit}&limit=${responseLimit}`)
            : this.http.get(`${this.API_URL}/account/create_enterprise_member/?search=${query}&limit=${responseLimit}`);
    }

    // add enterprise member
    addEnterpriseMember(formData): Observable<any> {
        return this.http.post(`${this.API_URL}/account/create_enterprise_member/`, formData);
    }

    // get user details
    getUserData(): Observable<IUserDetails> {
        return this.http.get<IUserDetails>(`${this.API_URL}/account/profile`);
    }

    // get member details
    getMemberData(memberId): Observable<IUserDetails> {
        return this.http.get<IUserDetails>(`${this.API_URL}/account/profile/${memberId}/`);
    }

    // Update Member
    updateMember(id, formData): Observable<any> {
        return this.http.patch(`${this.API_URL}/account/profile/${id}/`, formData);
    }

    selectSubParty(invoiceId, id, formData): Observable<any> {
        return this.http.patch(`${this.API_URL}/projects/invoices/${invoiceId}/subparty/${id}/`, formData);
    }

    // get licence history details
    getLicenceHistory(query): Observable<any> {


        const params = new HttpParams()
            .append("limit", query.limit)
            .append("offset", query.offset)
            .append("search", query.searchKey)


        return this.http.get(`${this.API_URL}/account/licenses_history/`, { params });
    }

    getActiveLicence(): Observable<any> {
        return this.http.get(`${this.API_URL}/account/active_license/`);
    }

    // get login status 
    getUserLoginstatus(): Observable<any> {
        return this.http.get(`${this.API_URL}/account/list_update_signinstatus/`);
    }

    // post login status 
    userLoginstatus() {
        return this.http.put(`${this.API_URL}/account/list_update_signinstatus/`, {});
    }

    applyToken(formValue): Observable<any> {
        return this.http.post(`${this.API_URL}/licenses/apply_coupon/`, formValue);
    }

    // get users and roles assigned to a project
    getProjectUsers(projectId): Observable<any> {
        return this.http.get(`${this.API_URL}/account/list_enterprise_project_role/` + projectId + `/`);
    }

    assignRole(formData) {
        return this.http.post(`${this.API_URL}/account/create_enterprise_project_role/`, formData);
    }

    unassignRole(role_id) {
        return this.http.delete(`${this.API_URL}/account/update_enterprise_project_role/${role_id}/`);
    }

    getAllAssignedUsers(): Observable<any> {
        return this.http.get(`${this.API_URL}/account/list_enterprise_project_role_view/`);
    }

    removeSubparty(subpartyId): Observable<any> {
        return this.http.delete(`${this.API_URL}/projects/subparty/${subpartyId}/`);
    }

    getProjectBasedRole(projectId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/user_project_role/${projectId}/`);
    }

    /* DISPUTES & CLAIMS */
    // get all disputes & claims
    getAllDisputes(projectId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/${projectId}/claims/`);
    }

    // register a dispute
    registerDispute(projectId, formValue): Observable<any> {
        return this.http.post(`${this.API_URL}/projects/${projectId}/claims/`, formValue);
    }

    // update claim details
    updateClaimDetails(claimId, params): Observable<any> {
        return this.http.patch(`${this.API_URL}/projects/claims/${claimId}/update/`, params);
    }

    // set status of dispute
    setDisputeStatus(projectId, claimId, status: string, cb){
        return this.http.patch(`${this.API_URL}/projects/${projectId}/claims/${claimId}/status/`, { status })
        .toPromise()
            .then(res => {
                cb(1, res)
            })
            .catch(err => {
                cb(2, err)
            })
    }

    // get claims schedule
    getClaimsSchedule(claimId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/claims_schedules/claim/${claimId}/`);
    }

    // get disputes & claims timeline
    getClaimsTimeline(projectId, claimId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/${projectId}/claims/${claimId}/`);
    }

    // set claim timeline table toggle status
    putClaimTableToggleStatus(claimId: string, dcschId: string, status: boolean) {
        return this.http.patch(`${this.API_URL}/projects/activites_schedules/claim/${claimId}/${dcschId}/update/`, {
            'is_active': status
        });
    }

    // add action or post highlighted actions
    postActionOrHighlightsFromClaimsTimeline(projectId, claimId, params): Observable<any> {
        return this.http.post(`${this.API_URL}/projects/${projectId}/claims/${claimId}/`, params);
    }

    // get claim settings
    getClaimSettings(projectId: string): Observable<IProjectSettings[]> {
        return this.http.get<IProjectSettings[]>(`${this.API_URL}/projects/${projectId}/claimsettings/`);
    }

    // update claim settings
    updateClaimSettings(projectId, params): Observable<any> {
        return this.http.put(`${this.API_URL}/projects/${projectId}/claimsettings/`, params);
    }


    /*  MISCELLANEOUS DOCUMENTS FOR DISPUTES */
    // upload miscellaneous document
    uploadMiscDocumentsDispute(file, claimId): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.API_URL}/projects/claim/${claimId}/docs/`, formData);
    }

    // get miscellaneous documents
    getMiscDocumentsDispute(claimId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/claim/${claimId}/docs/`);
    }

    // get root folders
    getRootFoldersDispute(claimId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/claim/${claimId}/folders/`);
    }

    // create root folder
    createRootFolderDispute(name, claimId): Observable<any> {
        return this.http.post(`${this.API_URL}/projects/claim/${claimId}/folders/`, name);
    }

    // get subfolders
    getSubFoldersDispute(claimId, folderId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/claim/${claimId}/folders/${folderId}/`);
    }

    // get files in subfolders
    getSubFolderFilesDispute(claimId, folderId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/claim/${claimId}/docs/${folderId}/`);
    }

    // create files in subfolders
    uploadSubFolderFileDispute(file, claimId, folderId): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.API_URL}/projects/claim/${claimId}/docs/${folderId}/`, formData);
    }

    // create new folder in sub folder
    createFolderInSubFolderDispute(name, claimId, folderId): Observable<any> {
        return this.http.post(`${this.API_URL}/projects/claim/${claimId}/folders/${folderId}/`, name);
    }

    // get all claim notifications
    getAllClaimNotifications(): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/notifications/claims/`);
    }

    // mark notification as read
    claimnotificationRead(notificationId: string): Observable<any> {
        return this.http.put(`${this.API_URL}/projects/notifications/claims/${notificationId}/read`, {});
    }
    // delete member
    deleteMember(member_id, deleteStatus): Observable<any> {
        return this.http.delete(`${this.API_URL}/account/delete_enterprise_member/${member_id}/${deleteStatus}/`);
    }

    // get user history for invoice
    getUserInvoiceHistory(invoiceId): Observable<any> {
        return this.http.get(`${this.API_URL}/account/user_invoicehistory/${invoiceId}/`);
    }

    // get user history for claims
    getUserClaimsHistory(claimId): Observable<any> {
        return this.http.get(`${this.API_URL}/account/user_claimhistory/${claimId}/`);
    }

    // get invoice history
    getInvoiceHistory(invoiceId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/invoice/timeline_history/${invoiceId}/`);
    }

    // get claims history
    getClaimsHistory(claimId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/claim/timeline_history/${claimId}/`);
    }
    // delete folder
    deleteFolder(invoiceId, folderId): Observable<any> {
        return this.http.delete(`${this.API_URL}/projects/invoice/${invoiceId}/delete/folder/${folderId}/`);
    }
    deleteFile(invoiceId, fileId): Observable<any> {
        return this.http.delete(`${this.API_URL}/projects/invoice/${invoiceId}/delete/docs/${fileId}/`);
    }
    claimdeleteFolder(claimId, folderId): Observable<any> {
        return this.http.delete(`${this.API_URL}/projects/claim/${claimId}/delete/folder/${folderId}/`);
    }
    claimdeleteFile(claimId, fileId): Observable<any> {
        return this.http.delete(`${this.API_URL}/projects/claim/${claimId}/delete/docs/${fileId}/`);
    }


    /* DELETIONS */
    // project deletion
    projectDeletion(projectId): Observable<any> {
        return this.http.delete(`${this.API_URL}/projects/${projectId}/delete/`);
    }

    // invoice deletion
    invoiceDeletion(invoiceId): Observable<any> {
        return this.http.delete(`${this.API_URL}/projects/invoices/${invoiceId}/delete/`);
    }

    // claim deletion
    claimDeletion(claimId): Observable<any> {
        return this.http.delete(`${this.API_URL}/projects/claims/${claimId}/delete/`);
    }


    /* UNARCHIVE */
    // unarchive projects 
    unarchiveProject(projectId): Observable<any> {
        return this.http.patch(`${this.API_URL}/projects/${projectId}/archive/`, { is_archived: false });
    }

    // unarchive invoice 
    unarchiveInvoice(projectId, invoiceId): Observable<any> {
        return this.http.patch(`${this.API_URL}/projects/${projectId}/invoices/${invoiceId}/`, { is_archived: false });
    }

    // unarchive claim
    unarchiveClaim(projectId, claimId): Observable<any> {
        return this.http.patch(`${this.API_URL}/projects/${projectId}/archiveclaims/${claimId}`, { is_archived: false });
    }
    getInvoiceActivity(date): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/projects/invoice_day_view/${date}/`);
    }
    getClaimActivity(date): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/projects/claim_day_view/${date}/`);
    }

    // payment Get Token
    getToken(payment) {
        return this.http.post(`${this.API_URL}/converge/get_converge_token/`, payment);
    }

    getInvoiceDownloadHistory(docId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/invoicedocument/download/${docId}/`);
    }
    getClaimDownloadHistory(docId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/claimdocument/download/${docId}/`);
    }

    getInvoiceFolderDownloadHistory(docId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/invoicefolder/zipdownload/${docId}/`);
    }

    getClaimFolderDownloadHistory(docId): Observable<any> {
        return this.http.get(`${this.API_URL}/projects/claimfolder/zipdownload/${docId}/`);
    }

    getPrivateLicense(): Observable<any> {
        return this.http.get(`${this.API_URL}/account/list_assigned_licenses/`);
    }
    PaymentDetails(token): Observable<any> {
        return this.http.get(`${this.API_URL}/converge/get_paymenttoken/${token}`);
    }
    TempPaymentDetails(token): Observable<any> {
        return this.http.get(`${this.API_URL}/converge/get_temp_paymenttoken/${token}`);
    }

    
}
