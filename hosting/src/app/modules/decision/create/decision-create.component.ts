import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DecisionService } from '../../../core/services';

@Component({
    templateUrl: './decision-create.component.html',
    styleUrls: ['./decision-create.component.scss'],
})
export class DecisionCreateComponent {
    public decisionForm: FormGroup;

    constructor(private router: Router, private form: FormBuilder, private decisionService: DecisionService) {
        this.decisionForm = this.form.group({
            subject: [undefined, [Validators.required]],
            content: [undefined, [Validators.required]],
            destination: [undefined, [Validators.required]],
        });
    }

    public performCancel(): void {
        this.router.navigate(['/', 'dashboard'], { replaceUrl: true });
    }

    public createDecision(): void {
        const decision = this.decisionForm.getRawValue();
        this.decisionService.create(decision.destination, decision.subject, decision.content).subscribe(() => this.router.navigate(['/', 'dashboard'], { replaceUrl: true }));
    }
}
