import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../models';
import { AuthenticationService } from '../../services';

@Component({
    selector: 'agree-app-bar',
    templateUrl: './app-bar.component.html',
    styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent implements OnDestroy {
    public user: User;
    private isDestroyed: Subject<void> = new Subject<void>();

    constructor(private router: Router, private authenticationService: AuthenticationService) {
        this.authenticationService.user.pipe(takeUntil(this.isDestroyed)).subscribe((user: User) => (this.user = user));
    }

    public ngOnDestroy(): void {
        this.isDestroyed.complete();
        this.isDestroyed.next();
    }

    public performLogout(): void {
        this.authenticationService.logout().subscribe(() => this.router.navigate(['/']));
    }
}
