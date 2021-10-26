import { Injectable } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {
    constructor(private route: ActivatedRoute, private router: Router, private analytics: Analytics) {}

    public signup(): void {
        logEvent(this.analytics, 'sign_up', { page_title: this.getTitle() });
    }

    public login(): void {
        logEvent(this.analytics, 'login', { page_title: this.getTitle() });
    }

    public logout(): void {
        logEvent(this.analytics, 'logout', { page_title: this.getTitle() });
    }

    public pageView(): void {
        logEvent(this.analytics, 'page_view', { page_title: this.getTitle(), page_path: this.router.url });
    }

    public callToAction(category: string, label: string): void {
        logEvent(this.analytics, 'cta', { page_title: this.getTitle(), event_category: category, event_label: label });
    }

    private getTitle(): string {
        let route = this.route;
        let child = this.route.firstChild;

        while (child) {
            if (child.firstChild) {
                route = child.firstChild;
                child = route;
            } else {
                child = null;
            }
        }
        return route.snapshot.data.title ?? 'Unknown';
    }
}
