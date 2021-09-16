import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Decision } from '../../../core/models';
import { DecisionService } from './../../../core/services/decision.service';

@Component({
    selector: 'agree-decisions',
    templateUrl: './decisions.component.html',
    styleUrls: ['./decisions.component.scss'],
})
export class DecisionsComponent implements OnInit, OnDestroy {
    public decisions: Decision[] = [];

    private isDestroyed: Subject<void> = new Subject<void>();

    constructor(private route: ActivatedRoute, private decisionService: DecisionService) {}

    public ngOnInit(): void {
        this.decisions = this.route.snapshot.data.decisionData;

        this.decisionService
            .findAll()
            .pipe(takeUntil(this.isDestroyed))
            .subscribe((decisions) => (this.decisions = decisions));
    }

    public ngOnDestroy(): void {
        this.isDestroyed.next();
        this.isDestroyed.complete();
    }
}
