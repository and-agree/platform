import { catchError } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services';
import { throwError } from 'rxjs';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    public registerForm: FormGroup;
    public error = '';

    private _visibility = false;

    constructor(private form: FormBuilder, private router: Router, private authenticationService: AuthenticationService) {}

    public ngOnInit(): void {
        this.registerForm = this.form.group({
            email: [undefined, [Validators.required, Validators.email]],
            displayName: [undefined, [Validators.required, Validators.maxLength(20)]],
            password: [undefined, [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
        });
    }

    get visibility(): string {
        return this._visibility ? 'text' : 'password';
    }

    public toggleVisibility(event: Event): void {
        event.stopPropagation();
        this._visibility = !this._visibility;
    }

    public createAccount(): void {
        const credentials = this.registerForm.getRawValue();

        this.authenticationService
            .register(credentials.displayName, credentials.email, credentials.password)
            .pipe(
                catchError((err) => {
                    this.error = err.message;
                    return throwError(() => new Error(err));
                })
            )
            .subscribe(() => this.router.navigate(['/'], { replaceUrl: true }));
    }
}
