import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { from, Observable, of, ReplaySubject } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { User } from '../models';

function inputIsNotNullOrUndefined<T>(input: null | undefined | T): input is T {
    return input !== null && input !== undefined;
}
export function isNotNullOrUndefined<T>() {
    return (source$: Observable<null | undefined | T>) => source$.pipe(filter(inputIsNotNullOrUndefined));
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    public user: ReplaySubject<User | null> = new ReplaySubject<User | null>(1);

    constructor(private router: Router, private angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore) {}

    public signIn(email: string, password: string): Observable<void> {
        return from(this.angularFireAuth.signInWithEmailAndPassword(email, password)).pipe(
            map((credentials) => credentials.user!),
            map((user: firebase.User) => this.convertToUser(user)),
            tap(() => this.router.navigate(['/', 'dashboard'])),
            map((account) => this.user.next(account))
        );
    }

    public register(displayName: string, email: string, password: string): Observable<User> {
        return from(this.angularFireAuth.createUserWithEmailAndPassword(email, password)).pipe(
            map((credentials) => credentials.user!),
            mergeMap((user: firebase.User) => from(user.updateProfile({ displayName })).pipe(map(() => user))),
            map((user: firebase.User) => this.convertToUser(user)),
            mergeMap((user: User) => this.updateUser(user)),
            tap((account) => this.user.next(account))
        );
    }

    public sendReset(email: string): Observable<void> {
        return from(this.angularFireAuth.sendPasswordResetEmail(email));
    }

    public resetPassword(password: string, code: string): Observable<void> {
        return from(this.angularFireAuth.verifyPasswordResetCode(code)).pipe(
            mergeMap((email) => from(this.angularFireAuth.confirmPasswordReset(code, password)).pipe(map(() => email))),
            mergeMap((email) => this.signIn(email, password))
        );
    }

    public checkLoggedIn(): Observable<User> {
        return this.angularFireAuth.authState.pipe(
            mergeMap((user: firebase.User) => this.angularFirestore.collection<User>('users').doc<User>(user.uid).get()),
            mergeMap((snapshot: firebase.firestore.DocumentSnapshot<User>) => {
                if (snapshot.exists) {
                    return of(snapshot.data());
                } else {
                    return from(this.angularFireAuth.currentUser).pipe(
                        map((currentUser: firebase.User) => this.convertToUser(currentUser)),
                        mergeMap((user: User) => this.updateUser(user))
                    );
                }
            }),
            map((account): User => {
                this.user.next(account);
                return account;
            })
        );
    }

    public logout(): Observable<void> {
        const logout = this.angularFireAuth.signOut();
        return from(logout).pipe(
            take(1),
            mergeMap(() => of(this.router.navigate(['/']))),
            map(() => this.user.next(null))
        );
    }

    private convertToUser(firebaseUser: firebase.User): User {
        if (!firebaseUser) {
            throw new Error('no user');
        }

        const uid = firebaseUser.uid;
        const alias = firebaseUser.displayName;
        const email = firebaseUser.email;

        return { uid, alias, email };
    }

    private updateUser(user: User): Observable<User> {
        return from(this.angularFirestore.collection<User>('users').doc<User>(user.uid).set(user, { merge: true })).pipe(map(() => user));
    }
}
