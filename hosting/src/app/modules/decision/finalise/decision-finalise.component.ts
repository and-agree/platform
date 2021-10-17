import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Decision } from './../../../core/models';
import { DecisionService, StorageService } from './../../../core/services';
import { DecisionFinaliseDialogComponent } from './finalise-dialog/decision-finalise-dialog.component';

@Component({
    templateUrl: './decision-finalise.component.html',
    styleUrls: ['./decision-finalise.component.scss'],
})
export class DecisionFinaliseComponent {
    public decision: Decision;
    public finaliseForm: FormGroup;
    public documentForm: FormGroup;

    @ViewChild('attachments')
    public attachments: MatSelectionList;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private forms: FormBuilder,
        private dialog: MatDialog,
        private storageService: StorageService,
        private decisionService: DecisionService
    ) {
        this.decision = this.route.snapshot.data.decision;

        this.finaliseForm = this.forms.group({
            conclusion: [undefined, [Validators.maxLength(1000)]],
        });

        this.documentForm = this.forms.group({
            upload: this.forms.array([]),
        });
    }

    get documents(): FormArray {
        return <FormArray>this.documentForm.get('upload');
    }

    public saveFile(event: any, documentForm: AbstractControl) {
        event.preventDefault();

        const reader = new FileReader();
        const file: File = (event.dataTransfer || event.target).files[0];

        reader.addEventListener('load', () => {
            this.storageService.uploadFile(reader.result as ArrayBuffer).subscribe((data) => {
                documentForm.get('name').setValue(file.name);
                documentForm.get('path').setValue(data.metadata.fullPath);
                documentForm.get('size').setValue(data.metadata.size);
            });
        });

        try {
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.log(error);
        }
    }

    public createDocument(): FormGroup {
        return this.forms.group({
            name: [{ value: undefined, disabled: true }, [Validators.required, Validators.maxLength(100)]],
            path: [undefined, [Validators.required]],
            size: [undefined, [Validators.required]],
            approved: [true, []],
        });
    }

    public addDocument(): void {
        this.documents.push(this.createDocument());
    }

    public removeDocument(index: number): void {
        this.documents.removeAt(index);
    }

    public finaliseDecision(): void {
        const finaliseData = this.finaliseForm.getRawValue();
        finaliseData.documents = (this.attachments?.options || []).map((option: MatListOption) => ({ ...option.value, approved: option.selected }));

        const documentData = this.documentForm.getRawValue().upload;
        finaliseData.documents = [ ...finaliseData.documents, ...documentData ];

        of(this.openDialog())
            .pipe(switchMap(() => this.decisionService.finalise(this.decision.uid, finaliseData)))
            .subscribe();
    }

    private openDialog(): void {
        const dialogRef = this.dialog.open(DecisionFinaliseDialogComponent, { disableClose: true });
        dialogRef
            .afterClosed()
            .pipe(filter((result) => !!result))
            .subscribe(() => this.router.navigate(['/', 'dashboard'], { replaceUrl: true }));
    }
}
