import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Account } from '../../models';
import { AuthenticationService } from '../../services';

@Component({
    selector: 'agree-app-bar',
    templateUrl: './app-bar.component.html',
    styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent implements OnDestroy {
    public account: Account;
    private isDestroyed: Subject<void> = new Subject<void>();

    constructor(private router: Router, private authenticationService: AuthenticationService) {
        this.authenticationService.user.pipe(takeUntil(this.isDestroyed)).subscribe((account: Account) => (this.account = account));
    }

    public ngOnDestroy(): void {
        this.isDestroyed.next();
        this.isDestroyed.complete();
    }

    public performLogout(): void {
        this.authenticationService.logout().subscribe(() => this.router.navigate(['/']));
    }
}
