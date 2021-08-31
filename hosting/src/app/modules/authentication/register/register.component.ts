import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    public registerForm: FormGroup;

    private _visibility = false;

    constructor(private form: FormBuilder, private router: Router, private authenticationService: AuthenticationService) {}

    public ngOnInit(): void {
        this.registerForm = this.form.group({
            email: [undefined, [Validators.required, Validators.email]],
            displayName: [undefined, [Validators.required, Validators.maxLength(32)]],
            password: [undefined, [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
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

        this.authenticationService.register(credentials.displayName, credentials.email, credentials.password).subscribe(() => this.router.navigate(['/'], { replaceUrl: true }));
    }
}
