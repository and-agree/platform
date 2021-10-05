import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'agree-error-message',
    templateUrl: './error-message.component.html',
})
export class ErrorMessageComponent {
    @Input()
    public control: AbstractControl;

    get errorMessage(): string {
        const errors = this.control.errors || {};
        const keys = Object.keys(errors);

        if (keys.includes('required')) {
            return 'This is required';
        }

        if (keys.includes('email')) {
            return 'Please provide a valid email address';
        }

        if (keys.includes('maxlength')) {
            const expected = errors.maxlength?.requiredLength;
            const actual = errors.maxlength?.actualLength;
            const difference = actual - expected;
            return `Exceeds max length of ${expected} by ${difference} ${difference === 1 ? 'character' : 'characters'}`;
        }

        return 'Unknown validation error';
    }
}
