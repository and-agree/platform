import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { DecisionService } from '../../../core/services';

@Component({
    templateUrl: './decision-create.component.html',
    styleUrls: ['./decision-create.component.scss'],
})
export class DecisionCreateComponent {
    public decisionForm: FormGroup;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(private router: Router, private form: FormBuilder, private decisionService: DecisionService) {
        this.decisionForm = this.form.group({
            destination: this.form.array([], [Validators.required]),
            subject: [undefined, [Validators.required]],
            content: [undefined, [Validators.required]],
        });
    }

    get destinations(): FormArray {
        return <FormArray>this.decisionForm.controls.destination;
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
        const decision = this.decisionForm.getRawValue();
        this.decisionService.create(decision.destination, decision.subject, decision.content).subscribe(() => this.router.navigate(['/', 'dashboard'], { replaceUrl: true }));
    }
}
