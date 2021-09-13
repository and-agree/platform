import { Injectable, Optional } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
    constructor(private router: Router, @Optional() private fireAuth: Auth) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return authState(this.fireAuth).pipe(
            take(1),
            map((user) => !user),
            map((result) => {
                if (result) {
                    this.router.navigate(['/']);
                }
                return true;
            })
        );
    }
}
