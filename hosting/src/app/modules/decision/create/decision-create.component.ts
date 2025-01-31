import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Account, Decision, DecisionDocument, DecisionGeneral } from '../../../core/models';
import { AuthenticationService, DecisionService, StorageService } from '../../../core/services';
import { DecisionSuccessDialogComponent } from './success-dialog/decision-success-dialog.component';

@Component({
    templateUrl: './decision-create.component.html',
    styleUrls: ['./decision-create.component.scss'],
})
export class DecisionCreateComponent {
    public generalForm: FormGroup;
    public teamForm: FormGroup;
    public documentForm: FormGroup;

    public deciderCtrl = new FormControl(undefined, Validators.required);

    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(
        private router: Router,
        private forms: FormBuilder,
        private dialog: MatDialog,
        private authenticationService: AuthenticationService,
        private storageService: StorageService,
        private decisionService: DecisionService
    ) {
        this.generalForm = this.forms.group({
            title: [undefined, [Validators.required, Validators.maxLength(100)]],
            goal: [undefined, [Validators.maxLength(100)]],
            background: [undefined, [Validators.required, Validators.maxLength(1000)]],
            instructions: [undefined, [Validators.maxLength(100)]],
            deadline: [new Date(), [Validators.required]],
        });

        this.teamForm = this.forms.group({
            managers: this.forms.array([], [Validators.required]),
            deciders: this.forms.array([], [Validators.required]),
            viewers: this.forms.array([], [Validators.required]),
        });

        this.documentForm = this.forms.group({
            upload: this.forms.array([]),
        });

        const user = this.authenticationService.user.value;
        this.addManager(user);
        this.addViewer(user);
    }

    get managers(): FormArray {
        return <FormArray>this.teamForm.get('managers');
    }

    get deciders(): FormArray {
        return <FormArray>this.teamForm.get('deciders');
    }

    get viewers(): FormArray {
        return <FormArray>this.teamForm.get('viewers');
    }

    get documents(): FormArray {
        return <FormArray>this.documentForm.get('upload');
    }

    public addManager(user: Account): void {
        if (!this.managers.value.some((manager) => manager.uid === user.uid)) {
            this.managers.push(
                this.forms.group({
                    uid: user.uid,
                    email: user.email,
                })
            );
        }
    }

    public addViewer(user: Account): void {
        if (!this.viewers.value.some((manager) => manager.uid === user.uid)) {
            this.viewers.push(
                this.forms.group({
                    uid: user.uid,
                    email: user.email,
                })
            );
        }
    }

    public addDecider(event: MatChipInputEvent): void {
        const value = event.value.trim();
        if (!value) {
            return;
        }

        if (!this.deciders.value.some((decider) => decider.email === value)) {
            this.deciders.push(
                this.forms.group({
                    email: [value, [Validators.email]],
                    pending: true,
                    status: 'UNDEFINED',
                })
            );
        }

        event.chipInput?.clear();
    }

    public removeDecider(idx: number): void {
        this.deciders.removeAt(idx);
    }

    public createDocument(): FormGroup {
        return this.forms.group({
            name: [{ value: undefined, disabled: true }, [Validators.required, Validators.maxLength(100)]],
            path: [undefined, [Validators.required]],
            size: [undefined, [Validators.required]],
            approved: [false, []],
        });
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

    public addDocument(): void {
        this.documents.push(this.createDocument());
    }

    public removeDocument(index: number): void {
        this.documents.removeAt(index);
    }

    public performCancel(): void {
        this.router.navigate(['/', 'dashboard'], { replaceUrl: true });
    }

    public createDecision(): void {
        const general: DecisionGeneral = this.generalForm.getRawValue();
        const documents: DecisionDocument[] = this.documentForm.getRawValue().upload;
        const team: Pick<Decision, 'managers' | 'deciders' | 'viewers'> = this.teamForm.getRawValue();

        this.decisionService
            .create(general, team, documents)
            .pipe(tap((decision: Decision) => this.openDialog(decision)))
            .subscribe();
    }

    private openDialog(decision: Decision): void {
        const dialogRef = this.dialog.open(DecisionSuccessDialogComponent, { disableClose: true });
        dialogRef
            .afterClosed()
            .pipe(filter((result) => !!result))
            .subscribe(() => this.router.navigate(['/', 'decision', 'view', decision.uid], { replaceUrl: true }));
    }
}
