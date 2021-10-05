import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, map, skip, switchMap, takeUntil } from 'rxjs/operators';
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
    public searchForm: FormGroup;

    public sortOptions = [
        { display: 'Title', field: 'title', direction: 'asc' },
        { display: 'Feedback recieved', field: 'responses', direction: 'desc' },
        { display: 'Deadline', field: 'deadline', direction: 'asc' },
        { display: 'Created date', field: 'created', direction: 'desc' },
    ];

    private isDestroyed: Subject<void> = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private forms: FormBuilder,
        private decisionService: DecisionService,
        private filterPipe: FilterPipe
    ) {
        this.searchForm = this.forms.group({
            search: [undefined],
            sort: [undefined],
        });
    }

    public ngOnInit(): void {
        this.route.data.pipe(takeUntil(this.isDestroyed)).subscribe((data) => (this.decisions = data.pendingData));

        this.route.queryParams
            .pipe(
                takeUntil(this.isDestroyed),
                map((params) => this.sortOptions.find((option) => option.field === params.sort)),
                switchMap((sort) => this.decisionService.findAll('PENDING', sort).pipe(takeUntil(this.isDestroyed), skip(1)))
            )
            .subscribe((decisions) => (this.decisions = decisions));

        this.searchForm.reset({ sort: 'responses', ...this.route.snapshot.queryParams });
        this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe(() => this.performSearch());
    }

    public ngOnDestroy(): void {
        this.isDestroyed.next();
        this.isDestroyed.complete();
    }

    public get search(): string {
        return this.searchForm.get('search').value;
    }

    public performSearch(): void {
        const filters = this.searchForm.getRawValue();

        if (!filters.search) {
            delete filters.search;
        }

        const queryParams = Object.keys(filters).reduce((reduce, next) => ({ ...reduce, [next]: filters[next] }), {});
        const replaceUrl = true;

        this.router.navigate([], { queryParams, replaceUrl });
    }
}
