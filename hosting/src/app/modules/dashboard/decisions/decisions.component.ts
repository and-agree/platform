import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Decision } from '../../../core/models';

@Component({
    selector: 'agree-decisions',
    templateUrl: './decisions.component.html',
    styleUrls: ['./decisions.component.scss'],
})
export class DecisionsComponent implements OnInit {
    public decisions: Decision[] = [];

    constructor(private route: ActivatedRoute) {}

    public ngOnInit(): void {
        this.decisions = this.route.snapshot.data.decisionData;
    }
}
