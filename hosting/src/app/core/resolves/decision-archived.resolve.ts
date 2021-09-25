import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Decision } from '../models';
import { DecisionService } from '../services';

@Injectable({
    providedIn: 'root',
})
export class DecisionArchivedResolve implements Resolve<Decision[]> {
    constructor(private decisionService: DecisionService) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Decision[]> {
        return this.decisionService.findAll('ARCHIVED').pipe(take(1));
    }
}
