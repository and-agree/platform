import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Decision } from '../models';
import { DecisionService } from '../services';

@Injectable({
    providedIn: 'root',
})
export class DecisionRetrieveResolve implements Resolve<Decision> {
    constructor(private decisionService: DecisionService) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Decision> {
        return this.decisionService.retrieve(route.params.decisionId).pipe(
            take(1),
            switchMap((decision) =>
                this.decisionService.retrieveResponses(route.params.decisionId).pipe(
                    take(1),
                    map((responses) => ({ ...decision, responses }))
                )
            )
        );
    }
}
