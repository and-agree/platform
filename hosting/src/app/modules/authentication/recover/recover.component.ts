import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services';

@Component({
    templateUrl: './recover.component.html',
    styleUrls: ['./recover.component.scss'],
})
export class RecoverComponent implements OnInit {
    public error: string;
    public recoverForm: FormGroup;

    constructor(private route: ActivatedRoute, private router: Router, private form: FormBuilder, private authenticationService: AuthenticationService) {}

    public ngOnInit(): void {
        this.recoverForm = this.form.group({
            password: [undefined, [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
        });
    }

    public resetPassword(): void {
        const code = this.route.snapshot.queryParams.oobCode;
        const credentials = this.recoverForm.getRawValue();

        this.authenticationService
            .resetPassword(credentials.password, code)
            .pipe(catchError((err) => (this.error = err.message)))
            .subscribe();
    }
}
