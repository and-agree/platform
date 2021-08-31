import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
    constructor(private router: Router, private angularFireAuth: AngularFireAuth) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.angularFireAuth.authState.pipe(
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
