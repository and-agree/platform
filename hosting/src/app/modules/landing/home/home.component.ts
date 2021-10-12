import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    public signupForm: FormGroup;

    constructor(private forms: FormBuilder) {
        this.signupForm = this.forms.group({
            email: [undefined, [Validators.required, Validators.email]],
        });
    }

    public performSignup(): void {
        console.log('coming soon');
    }
}
