import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { skip, Subject, takeUntil } from 'rxjs';
import { Decision } from '../../../core/models';
import { DecisionService } from './../../../core/services/decision.service';
import { FilterPipe } from './../../../shared/pipes/filter.pipe';

@Component({
    selector: 'agree-dashboard-pending',
    templateUrl: './dashboard-pending.component.html',
    styleUrls: ['./dashboard-pending.component.scss'],
})
export class DashboardPendingComponent implements OnInit, OnDestroy {
    public decisions: Decision[] = [];

    private isDestroyed: Subject<void> = new Subject<void>();

    constructor(private route: ActivatedRoute, private decisionService: DecisionService, private filterPipe: FilterPipe) {}

    public ngOnInit(): void {
        this.decisions = this.route.snapshot.data.pendingData;

        this.decisionService
            .findAll('PENDING')
            .pipe(skip(1), takeUntil(this.isDestroyed))
            .subscribe((decisions) => (this.decisions = decisions));
    }

    public ngOnDestroy(): void {
        this.isDestroyed.next();
        this.isDestroyed.complete();
    }

    public feedbackPercent(decision: Decision): number {
        const expected = decision.deciders.length;
        const actual = this.filterPipe.transform(decision.deciders, 'pending', false).length;

        return (actual / expected) * 100;
    }
}
