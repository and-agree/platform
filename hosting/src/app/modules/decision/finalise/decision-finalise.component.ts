import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { Decision } from './../../../core/models';
import { DecisionService } from './../../../core/services';

@Component({
    templateUrl: './decision-finalise.component.html',
    styleUrls: ['./decision-finalise.component.scss'],
})
export class DecisionFinaliseComponent {
    public decision: Decision;
    public finaliseForm: FormGroup;

    @ViewChild('documents')
    public documents: MatSelectionList;

    constructor(private route: ActivatedRoute, private router: Router, private forms: FormBuilder, private decisionService: DecisionService) {
        this.decision = this.route.snapshot.data.decision;

        this.finaliseForm = this.forms.group({
            conclusion: [undefined, [Validators.maxLength(1000)]],
        });
    }

    public finaliseDecision(): void {
        const finaliseData = this.finaliseForm.getRawValue();
        finaliseData.documents = this.documents.options.map((option: MatListOption) => ({ ...option.value, attach: option.selected }));

        this.decisionService.finalise(this.decision.uid, finaliseData).subscribe(() => this.router.navigate(['/', 'dashboard']));
    }
}
