import { Injectable, Optional } from '@angular/core';
import {
    Auth,
    authState,
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
    UserCredential,
    verifyPasswordResetCode,
} from '@angular/fire/auth';
import { collection, doc, DocumentSnapshot, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { from, Observable, of, BehaviorSubject } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { Account } from '../models';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    public user: BehaviorSubject<Account> = new BehaviorSubject<Account>(null);
    private storage: Storage = sessionStorage;

    constructor(private router: Router, @Optional() private fireAuth: Auth, private firestore: Firestore) {}

    public signIn(email: string, password: string): Observable<Account> {
        const redirect = this.storage.getItem('redirect') || 'dashboard';

        return from(signInWithEmailAndPassword(this.fireAuth, email, password)).pipe(
            map((credentials: UserCredential) => credentials.user),
            mergeMap((user: User) => this.retrieveAccount(user.uid)),
            tap(() => this.router.navigate(['/', ...redirect.split('/').filter(Boolean)])),
            tap(() => this.storage.removeItem('redirect'))
        );
    }

    public register(displayName: string, email: string, password: string): Observable<Account> {
        const companyId = doc(collection(this.firestore, '_')).id;

        return from(createUserWithEmailAndPassword(this.fireAuth, email, password)).pipe(
            map((credentials: UserCredential) => credentials.user),
            mergeMap((user: User) => from(updateProfile(user, { displayName })).pipe(map(() => user))),
            mergeMap((user: User) => this.updateUser({ ...user, companyId })),
            mergeMap((user: User) => this.retrieveAccount(user.uid))
        );
    }

    public sendReset(email: string): Observable<void> {
        return from(sendPasswordResetEmail(this.fireAuth, email));
    }

    public resetPassword(password: string, code: string): Observable<Account> {
        return from(verifyPasswordResetCode(this.fireAuth, code)).pipe(
            mergeMap((email) => from(confirmPasswordReset(this.fireAuth, code, password)).pipe(map(() => email))),
            mergeMap((email) => this.signIn(email, password))
        );
    }

    public checkLoggedIn(): Observable<Account> {
        return authState(this.fireAuth).pipe(mergeMap((user) => this.retrieveAccount(user.uid)));
    }

    public logout(): Observable<void> {
        const logout = signOut(this.fireAuth);
        return from(logout).pipe(
            take(1),
            mergeMap(() => of(this.router.navigate(['/']))),
            map(() => this.user.next(null))
        );
    }

    private retrieveAccount(userId: string): Observable<Account> {
        return from(getDoc(doc(this.firestore, `users/${userId}`))).pipe(
            map((snapshot: DocumentSnapshot<Account>) => snapshot.data()),
            tap((account) => this.user.next(account))
        );
    }

    private updateUser(user: User & Partial<Account>): Observable<User> {
        const uid = user.uid;
        const alias = user.displayName;
        const email = user.email;
        const companyId = user.companyId;

        return from(setDoc(doc(this.firestore, `users/${user.uid}`), { uid, alias, email, companyId }, { merge: true })).pipe(map(() => user));
    }
}
