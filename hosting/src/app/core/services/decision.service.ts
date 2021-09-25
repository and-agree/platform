import { Injectable } from '@angular/core';
import {
    collection,
    collectionData,
    CollectionReference,
    doc,
    docSnapshots,
    DocumentSnapshot,
    Firestore,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    Timestamp,
    where,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Decision, DecisionDocument, DecisionGeneral } from '../models';
import { DecisionResponse, DecisionStatus, TeamDecider } from './../models/decision';
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

    public create(general: DecisionGeneral, deciders: TeamDecider[], documents: DecisionDocument[]): Observable<Decision> {
        const uid = doc(collection(this.firestore, '_')).id;
        const status = 'CREATED';
        const created = serverTimestamp() as Timestamp;
        const companyId = this.companyId;
        const decision: Decision = { uid, general, deciders, documents, status, created, companyId };

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

    public finalise(decisionId, finaliseData: Partial<Decision>): Observable<void> {
        finaliseData.status = 'COMPLETE';
        finaliseData.completed = serverTimestamp() as Timestamp;
        return from(setDoc(doc(this.firestore, `decisions/${decisionId}`), finaliseData, { merge: true }));
    }

    public findAll(status: DecisionStatus): Observable<Decision[]> {
        const decisionQuery = query<Decision>(this.decisionCollection, where('companyId', '==', this.companyId), where('status', '==', status), orderBy('created', 'desc'));
        return collectionData(decisionQuery);
    }
}
