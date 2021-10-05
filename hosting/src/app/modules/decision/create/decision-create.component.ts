import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DecisionDocument, DecisionGeneral, TeamDecider } from '../../../core/models';
import { AuthenticationService, DecisionService } from '../../../core/services';

@Component({
    templateUrl: './decision-create.component.html',
    styleUrls: ['./decision-create.component.scss'],
})
export class DecisionCreateComponent {
    public generalForm: FormGroup;
    public teamForm: FormGroup;
    public documentForm: FormGroup;

    public deciderCtrl = new FormControl(undefined, Validators.required);

    public user = this.authenticationService.user.value;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(private router: Router, private forms: FormBuilder, private authenticationService: AuthenticationService, private decisionService: DecisionService) {
        this.generalForm = this.forms.group({
            title: [undefined, [Validators.required, Validators.maxLength(100)]],
            goal: [undefined, [Validators.maxLength(100)]],
            background: [undefined, [Validators.required, Validators.maxLength(1000)]],
            instructions: [undefined, [Validators.maxLength(100)]],
            deadline: [new Date(), [Validators.required]],
        });

        this.teamForm = this.forms.group({
            destinations: this.forms.array([], [Validators.required]),
        });

        this.documentForm = this.forms.group({
            list: this.forms.array([]),
        });
    }

    get destinations(): FormArray {
        return <FormArray>this.teamForm.controls.destinations;
    }

    get documents(): FormArray {
        return <FormArray>this.documentForm.controls.list;
    }

    public addDestination(event: MatChipInputEvent): void {
        const value = event.value.trim();
        if (!value) {
            return;
        }

        if (!this.destinations.value.includes(value)) {
            this.destinations.push(this.forms.control(value, [Validators.email]));
        }

        event.chipInput?.clear();
    }

    public removeDestination(idx: number): void {
        this.destinations.removeAt(idx);
    }

    public createDocument(): FormGroup {
        return this.forms.group({
            name: [undefined, [Validators.required, Validators.maxLength(100)]],
            file: [undefined, [Validators.required]],
        });
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
        const documents: DecisionDocument[] = this.documentForm.get('list').value;

        const deciders: TeamDecider[] = this.destinations.value.map((destination: string) => ({
            email: destination.toLowerCase(),
            pending: true,
            response: 'UNDEFINED',
        }));

        this.decisionService
            .create(general, deciders, documents)
            .pipe(map((decision) => this.router.navigate(['/', 'decision', 'view', decision.uid], { replaceUrl: true })))
            .subscribe();
    }
}
