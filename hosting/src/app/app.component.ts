import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AnalyticsService } from './core/services';

@Component({
    selector: 'agree-root',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
    constructor(private router: Router, private analyticsService: AnalyticsService) {}

    public ngOnInit(): void {
        this.router.events
            .pipe(
                filter((event: any) => event instanceof NavigationEnd),
                map(() => this.analyticsService.pageView())
            )
            .subscribe();
    }
}
