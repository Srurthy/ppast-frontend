import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { UserService } from './services/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
    subscriptions: Subscription;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.subscriptions = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map( _ => this.activatedRoute),
            map(route => {
                while(route.firstChild) route = route.firstChild;
                return route;
            }),
            filter(route => route.outlet === 'primary'),
            mergeMap(route => route.data),
        ).subscribe((event) => {
            this.titleService.setTitle(event['title']);
            this.userService.headerPageTitle$.next(event['title']);
        });
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
