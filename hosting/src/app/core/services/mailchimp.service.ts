import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MailchimpMember } from '../models';

@Injectable({
    providedIn: 'root',
})
export class MailchimpService {
    constructor(private functions: Functions) {}

    public members(data: MailchimpMember): Observable<void> {
        const subscribe = httpsCallable<any, void>(this.functions, 'MailchimpSubscribe');
        return from(subscribe(data)).pipe(map(() => null));
    }
}
