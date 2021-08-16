import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { from, map, Observable } from 'rxjs';
import { Decision } from '../models';

@Injectable({
    providedIn: 'root',
})
export class DecisionService {
    constructor(private angularFirestore: AngularFirestore) {}

    public create(destination: string[], subject: string, body: string): Observable<Decision> {
        const uid = this.angularFirestore.createId();
        const status = 'CREATED';
        const created = firebase.firestore.FieldValue.serverTimestamp();
        const decision: Decision = { uid, subject, body, destination, status, created };

        const decisionDoc = this.angularFirestore.collection<Decision>('decisions').doc<Decision>(decision.uid);
        return from(decisionDoc.set(decision)).pipe(map(() => decision));
    }

    public findAll(): Observable<Decision[]> {
        return this.angularFirestore.collection<Decision>('decisions', (ref) => ref.orderBy('created', 'desc')).valueChanges();
    }
}
