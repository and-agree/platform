import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MailchimpService } from 'src/app/core/services/mailchimp.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    public signupForm: FormGroup;
    public subscribed = false;

    constructor(private forms: FormBuilder, private mailchimpService: MailchimpService) {
        this.signupForm = this.forms.group({
            email: [undefined, [Validators.required, Validators.email]],
            status: ['subscribed', []],
        });
    }

    public performSignup(): void {
        const signupData = this.signupForm.getRawValue();
        this.mailchimpService.members(signupData).subscribe(() => (this.subscribed = true));
    }
}
