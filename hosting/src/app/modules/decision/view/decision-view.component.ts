import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, skip, Subject, switchMap, takeUntil } from 'rxjs';
import { Decision, DecisionFeedbackStatus, TeamDecider } from './../../../core/models';
import { DecisionService } from './../../../core/services/decision.service';
import { FilterPipe } from './../../../shared/pipes';
import { DecisionDeleteDialogComponent } from './delete-dialog/decision-delete-dialog.component';
import { DecisionReminderDialogComponent } from './reminder-dialog/decision-reminder-dialog.component';

@Component({
    templateUrl: './decision-view.component.html',
    styleUrls: ['./decision-view.component.scss'],
})
export class DecisionViewComponent implements OnInit, OnDestroy {
    public decision: Decision;

    private isDestroyed: Subject<void> = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private decisionService: DecisionService,
        private filterPipe: FilterPipe
    ) {
        this.decision = this.route.snapshot.data.decision;
    }

    public ngOnInit(): void {
        this.decisionService
            .retrieve(this.route.snapshot.params.decisionId)
            .pipe(
                skip(1),
                takeUntil(this.isDestroyed),
                map((decision) => ({ ...this.decision, ...decision }))
            )
            .subscribe((decision) => (this.decision = decision));

        this.decisionService
            .retrieveFeedback(this.route.snapshot.params.decisionId)
            .pipe(skip(1), takeUntil(this.isDestroyed))
            .subscribe((feedback) => (this.decision.feedback = feedback));
    }

    public ngOnDestroy(): void {
        this.isDestroyed.next();
        this.isDestroyed.complete();
    }

    get feedbackPending(): TeamDecider[] {
        return this.filterPipe.transform(this.decision.deciders, 'pending', true);
    }

    get feedbackRecieved(): TeamDecider[] {
        return this.filterPipe.transform(this.decision.deciders, 'pending', false);
    }

    public sendReminders(): void {
        const dialogRef = this.dialog.open(DecisionReminderDialogComponent);
        dialogRef
            .afterClosed()
            .pipe(
                filter((result) => !!result),
                switchMap(() => this.decisionService.reminders(this.decision.uid))
            )
            .subscribe();
    }

    public changeFeedback(feedbackId: string, status: DecisionFeedbackStatus): void {
        this.decisionService.updateFeedback(this.decision.uid, feedbackId, { status });
    }

    public deleteDecision(): void {
        const dialogRef = this.dialog.open(DecisionDeleteDialogComponent);
        dialogRef
            .afterClosed()
            .pipe(
                filter((result) => !!result),
                switchMap(() => this.decisionService.remove(this.decision.uid))
            )
            .subscribe(() => this.router.navigate(['/', 'dashboard']));
    }
}
