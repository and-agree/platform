import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DecisionDocuments, DecisionGeneral, DecisionTeam } from '../../../core/models';
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

    constructor(private router: Router, private form: FormBuilder, private authenticationService: AuthenticationService, private decisionService: DecisionService) {
        this.generalForm = this.form.group({
            title: [undefined, [Validators.required]],
            goal: [undefined, []],
            background: [undefined, [Validators.required]],
            instructions: [undefined, []],
            deadline: [new Date(), [Validators.required]],
        });

        this.teamForm = this.form.group({
            destination: this.form.array([], [Validators.required]),
        });

        this.documentForm = this.form.group({
            decision: [undefined, []],
            information: [undefined, []],
        });
    }

    get destinations(): FormArray {
        return <FormArray>this.teamForm.controls.destination;
    }

    public add(event: MatChipInputEvent): void {
        const value = event.value.trim();
        if (!value) {
            return;
        }

        if (!this.destinations.value.includes(value)) {
            this.destinations.push(this.form.control(value, Validators.email));
        }

        event.chipInput?.clear();
    }

    public remove(idx: number): void {
        this.destinations.removeAt(idx);
    }

    public performCancel(): void {
        this.router.navigate(['/', 'dashboard'], { replaceUrl: true });
    }

    public createDecision(): void {
        const general: DecisionGeneral = this.generalForm.getRawValue();
        const documents: DecisionDocuments = this.documentForm.getRawValue();

        const team: DecisionTeam = {
            deciders: this.destinations.value.map((destination: string) => ({
                email: destination.toLowerCase(),
                pending: true,
                response: 'UNKNOWN',
            })),
        };

        this.decisionService
            .create(general, team, documents)
            .pipe(map((decision) => this.router.navigate(['/', 'decision', 'view', decision.uid], { replaceUrl: true })))
            .subscribe();
    }
}
