import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, doc, documentId, Firestore, orderBy, query, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Decision } from '../models';

@Injectable({
    providedIn: 'root',
})
export class DecisionService {
    private decisionCollection: CollectionReference<Decision>;

    constructor(private firestore: Firestore) {
        this.decisionCollection = collection(this.firestore, 'decisions').withConverter<Decision>({
            fromFirestore: (snap) => {
                const { uid, subject, body, destination, status, created } = snap.data();
                return { uid, subject, body, destination, status, created };
            },
            toFirestore: (data: any) => data,
        });
    }

    public create(destination: string[], subject: string, body: string): Observable<Decision> {
        const uid = doc(collection(this.firestore, '_')).id;
        const status = 'CREATED';
        const created = serverTimestamp();
        const decision: Decision = { uid, subject, body, destination, status, created };

        return from(setDoc(doc(this.firestore, `decisions/${uid}`), decision)).pipe(map(() => decision));
    }

    public findAll(): Observable<Decision[]> {
        const decisionQuery = query<Decision>(this.decisionCollection, orderBy('created', 'desc'));
        return collectionData(decisionQuery);
    }
}
