import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    public loginForm: FormGroup;

    private _visibility = false;

    constructor(private form: FormBuilder, private router: Router) {
        this.loginForm = this.form.group({
            email: [undefined, [Validators.required]],
            password: [undefined, [Validators.required]],
        });
    }

    get visibility(): string {
        return this._visibility ? 'text' : 'password';
    }

    public toggleVisibility(event: Event): void {
        event.stopPropagation();
        console.log('boom');
        this._visibility = !this._visibility;
    }

    public performLogin(): void {
        console.log(this.loginForm.getRawValue());
        this.router.navigate(['/', 'dashboard']);
    }
}
