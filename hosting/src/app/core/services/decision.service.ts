import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, doc, docData, docSnapshots, DocumentSnapshot, Firestore, getDoc, orderBy, query, serverTimestamp, setDoc, where } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Decision, DecisionDocuments, DecisionGeneral, DecisionTeam } from '../models';
import { DecisionResponse } from './../models/decision';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root',
})
export class DecisionService {
    private companyId = this.authenticationService.user.value.companyId;
    private decisionCollection: CollectionReference<Decision>;

    constructor(private firestore: Firestore, private authenticationService: AuthenticationService) {
        this.authenticationService.user.pipe().subscribe((user) => (this.companyId = user.companyId));

        this.decisionCollection = collection(this.firestore, 'decisions').withConverter<Decision>(null);
    }

    public create(general: DecisionGeneral, team: DecisionTeam, documents: DecisionDocuments): Observable<Decision> {
        const uid = doc(collection(this.firestore, '_')).id;
        const status = 'CREATED';
        const created = serverTimestamp();
        const companyId = this.companyId;
        const decision: Decision = { uid, general, team, documents, status, created, companyId };

        return from(setDoc(doc(this.firestore, `decisions/${uid}`), decision)).pipe(map(() => decision));
    }

    public retrieve(decisionId: string): Observable<Decision> {
        return docSnapshots(doc(this.firestore, `decisions/${decisionId}`)).pipe(map((snapshot: DocumentSnapshot<Decision>) => snapshot.data()));
    }

    public retrieveResponses(decisionId: string): Observable<DecisionResponse[]> {
        const responseCollection = collection(this.firestore, `decisions/${decisionId}/responses`).withConverter<DecisionResponse>(null);
        const responseQuery = query<DecisionResponse>(responseCollection, orderBy('created', 'asc'));
        return collectionData(responseQuery);
    }

    public findAll(): Observable<Decision[]> {
        const decisionQuery = query<Decision>(this.decisionCollection, where('companyId', '==', this.companyId), orderBy('created', 'desc'));
        return collectionData(decisionQuery);
    }
}
