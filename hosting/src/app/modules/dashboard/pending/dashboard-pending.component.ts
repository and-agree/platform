import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { skip, Subject, takeUntil } from 'rxjs';
import { Decision } from '../../../core/models';
import { DecisionService } from './../../../core/services/decision.service';

@Component({
    selector: 'agree-dashboard-pending',
    templateUrl: './dashboard-pending.component.html',
    styleUrls: ['./dashboard-pending.component.scss'],
})
export class DashboardPendingComponent implements OnInit, OnDestroy {
    public decisions: Decision[] = [];

    private isDestroyed: Subject<void> = new Subject<void>();

    constructor(private route: ActivatedRoute, private decisionService: DecisionService) {}

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
}
