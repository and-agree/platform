import { Directive, HostListener, Input } from '@angular/core';
import { AnalyticsService } from 'src/app/core/services';

@Directive({
    selector: 'button[agreeAnalytics], a[agreeAnalytics]',
})
export class AnalyticsDirective {
    constructor(private analyticsService: AnalyticsService) {}

    @Input()
    public agreeAnalytics: string[];

    @HostListener('click', ['$event'])
    public sendEvent(event: MouseEvent): void {
        event.stopPropagation();
        this.analyticsService.callToAction(this.agreeAnalytics[0], this.agreeAnalytics[1]);
    }
}
