import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'agree-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnChanges {
    public title: string;
    public message: string;
    public severity: 'info' | 'warning' | 'error';

    @Input()
    public code: string;

    public ngOnChanges(): void {
        this.processCode();
    }

    private processCode(): void {
        switch (this.code) {
            case 'auth/user-not-found':
                this.title = 'Authentication error';
                this.message = `The email address and password you entered didn't match our records. Please double check and try again.`;
                this.severity = 'warning';
                break;
            case 'auth/email-already-in-use':
                this.title = 'Registration error';
                this.message = 'Email address has already been registered.';
                this.severity = 'warning';
                break;
            default:
                console.log(this.code);
        }
    }
}
