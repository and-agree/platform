import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    public loginForm: FormGroup;
    public error = '';

    private _visibility = false;

    constructor(private form: FormBuilder, private authenticationService: AuthenticationService) {
        this.loginForm = this.form.group({
            email: [undefined, [Validators.required, Validators.email]],
            password: [undefined, [Validators.required]],
        });
    }

    get visibility(): string {
        return this._visibility ? 'text' : 'password';
    }

    public toggleVisibility(event: Event): void {
        event.stopPropagation();
        this._visibility = !this._visibility;
    }

    public performLogin(): void {
        const credentials = this.loginForm.getRawValue();

        this.authenticationService
            .signIn(credentials.email, credentials.password)
            .pipe(catchError((err) => (this.error = err.message)))
            .subscribe();
    }
}
