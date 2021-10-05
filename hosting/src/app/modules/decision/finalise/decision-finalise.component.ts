import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Decision } from './../../../core/models';
import { DecisionService } from './../../../core/services';
import { DecisionFinaliseDialogComponent } from './dialog/decision-finalise-dialog.component';

@Component({
    templateUrl: './decision-finalise.component.html',
    styleUrls: ['./decision-finalise.component.scss'],
})
export class DecisionFinaliseComponent {
    public decision: Decision;
    public finaliseForm: FormGroup;

    @ViewChild('documents')
    public documents: MatSelectionList;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private forms: FormBuilder,
        private dialog: MatDialog,
        private decisionService: DecisionService
    ) {
        this.decision = this.route.snapshot.data.decision;

        this.finaliseForm = this.forms.group({
            conclusion: [undefined, [Validators.maxLength(1000)]],
        });
    }

    public finaliseDecision(): void {
        const finaliseData = this.finaliseForm.getRawValue();
        finaliseData.documents = this.documents.options.map((option: MatListOption) => ({ ...option.value, attach: option.selected }));
        this.decisionService.finalise(this.decision.uid, finaliseData).subscribe(() => this.openDialog());
    }

    private openDialog(): void {
        const dialogRef = this.dialog.open(DecisionFinaliseDialogComponent, { disableClose: true });
        dialogRef
            .afterClosed()
            .pipe(filter((result) => !!result))
            .subscribe(() => this.router.navigate(['/', 'dashboard'], { replaceUrl: true }));
    }
}
