import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, doc, Firestore, orderBy, query, serverTimestamp, setDoc, where } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Decision } from '../models';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root',
})
export class DecisionService {
    private companyId = this.authenticationService.user.value.companyId;
    private decisionCollection: CollectionReference<Decision>;

    constructor(private firestore: Firestore, private authenticationService: AuthenticationService) {
        this.authenticationService.user.pipe().subscribe((user) => (this.companyId = user.companyId));

        this.decisionCollection = collection(this.firestore, 'decisions').withConverter<Decision>({
            fromFirestore: (snap) => {
                const { uid, subject, body, destination, status, created, companyId } = snap.data();
                return { uid, subject, body, destination, status, created, companyId };
            },
            toFirestore: (data: any) => data,
        });
    }

    public create(destination: string[], subject: string, body: string): Observable<Decision> {
        const uid = doc(collection(this.firestore, '_')).id;
        const status = 'CREATED';
        const created = serverTimestamp();
        const companyId = this.companyId;
        const decision: Decision = { uid, subject, body, destination, status, created, companyId };

        return from(setDoc(doc(this.firestore, `decisions/${uid}`), decision)).pipe(map(() => decision));
    }

    public findAll(): Observable<Decision[]> {
        const decisionQuery = query<Decision>(this.decisionCollection, where('companyId', '==', this.companyId), orderBy('created', 'desc'));
        return collectionData(decisionQuery);
    }
}
