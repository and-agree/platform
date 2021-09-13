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
    user,
    User,
    UserCredential,
    verifyPasswordResetCode,
} from '@angular/fire/auth';
import { doc, DocumentSnapshot, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { from, Observable, of, ReplaySubject } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { Account } from '../models';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    public user: ReplaySubject<Account> = new ReplaySubject<Account>(1);

    constructor(private router: Router, @Optional() private fireAuth: Auth, private firestore: Firestore) {}

    public signIn(email: string, password: string): Observable<void> {
        return from(signInWithEmailAndPassword(this.fireAuth, email, password)).pipe(
            map((credentials: UserCredential) => credentials.user),
            map((user: User) => this.convertToAccount(user)),
            map((account: Account) => this.user.next(account)),
            tap(() => this.router.navigate(['/', 'dashboard']))
        );
    }

    public register(displayName: string, email: string, password: string): Observable<Account> {
        return from(createUserWithEmailAndPassword(this.fireAuth, email, password)).pipe(
            map((credentials: UserCredential) => credentials.user),
            mergeMap((user: User) => from(updateProfile(user, { displayName })).pipe(map(() => user))),
            map((user: User) => this.convertToAccount(user)),
            mergeMap((account: Account) => this.updateUser(account)),
            tap((account: Account) => this.user.next(account))
        );
    }

    public sendReset(email: string): Observable<void> {
        return from(sendPasswordResetEmail(this.fireAuth, email));
    }

    public resetPassword(password: string, code: string): Observable<void> {
        return from(verifyPasswordResetCode(this.fireAuth, code)).pipe(
            mergeMap((email) => from(confirmPasswordReset(this.fireAuth, code, password)).pipe(map(() => email))),
            mergeMap((email) => this.signIn(email, password))
        );
    }

    public checkLoggedIn(): Observable<Account> {
        return authState(this.fireAuth).pipe(
            mergeMap((user) => getDoc(doc(this.firestore, `users/${user.uid}`))),
            mergeMap((snapshot: DocumentSnapshot<Account>) => {
                if (snapshot.exists) {
                    return of(snapshot.data());
                } else {
                    return from(user(this.fireAuth)).pipe(
                        map((currentUser: User) => this.convertToAccount(currentUser)),
                        mergeMap((account: Account) => this.updateUser(account))
                    );
                }
            }),
            map((account): Account => {
                this.user.next(account);
                return account;
            })
        );
    }

    public logout(): Observable<void> {
        const logout = signOut(this.fireAuth);
        return from(logout).pipe(
            take(1),
            mergeMap(() => of(this.router.navigate(['/']))),
            map(() => this.user.next(null))
        );
    }

    private convertToAccount(firebaseUser: User): Account {
        if (!firebaseUser) {
            throw new Error('no user');
        }

        const uid = firebaseUser.uid;
        const alias = firebaseUser.displayName;
        const email = firebaseUser.email;

        return { uid, alias, email };
    }

    private updateUser(account: Account): Observable<Account> {
        return from(setDoc(doc(this.firestore, `users/${account.uid}`), account, { merge: true })).pipe(map(() => account));
    }
}
