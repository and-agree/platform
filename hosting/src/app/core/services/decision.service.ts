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
    OrderByDirection,
    query,
    serverTimestamp,
    setDoc,
    Timestamp,
    where,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { writeBatch } from '@firebase/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Decision, DecisionDocument, DecisionGeneral } from '../models';
import { DecisionFeedback, DecisionStatus, TeamDecider } from './../models/decision';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root',
})
export class DecisionService {
    private companyId = this.authenticationService.user.value.companyId;
    private decisionCollection: CollectionReference<Decision>;

    constructor(private firestore: Firestore, private functions: Functions, private authenticationService: AuthenticationService) {
        this.authenticationService.user.pipe().subscribe((user) => (this.companyId = user.companyId));

        this.decisionCollection = collection(this.firestore, 'decisions').withConverter<Decision>(null);
    }

    public create(general: DecisionGeneral, deciders: TeamDecider[], documents: DecisionDocument[]): Observable<Decision> {
        const uid = doc(collection(this.firestore, '_')).id;
        const responses = 0;
        const status = 'CREATED';
        const created = serverTimestamp() as Timestamp;
        const companyId = this.companyId;
        const decision: Decision = { ...general, uid, deciders, documents, responses, status, created, companyId };

        return from(setDoc(doc(this.firestore, `decisions/${uid}`), decision)).pipe(map(() => decision));
    }

    public retrieve(decisionId: string): Observable<Decision> {
        return docSnapshots(doc(this.firestore, `decisions/${decisionId}`)).pipe(map((snapshot: DocumentSnapshot<Decision>) => snapshot.data()));
    }

    public finalise(decisionId, finaliseData: Partial<Decision>): Observable<void> {
        const finalise = httpsCallable<any, void>(this.functions, 'DecisionFinalise');
        return from(finalise({ decisionId, ...finaliseData })).pipe(map(() => null));
    }

    public findAll(status: DecisionStatus, sort = { field: 'responses', direction: 'desc' }): Observable<Decision[]> {
        let whereClauses = [where('companyId', '==', this.companyId), where('status', '==', status)];

        let orderClauses = [orderBy('created', 'desc')];
        if (sort.field !== 'created') {
            orderClauses = [orderBy(sort.field, sort.direction as OrderByDirection), ...orderClauses];
        }

        const decisionQuery = query<Decision>(this.decisionCollection, ...whereClauses, ...orderClauses);
        return collectionData(decisionQuery);
    }

    public retrieveFeedback(decisionId: string): Observable<DecisionFeedback[]> {
        const feedbackCollection = collection(this.firestore, `decisions/${decisionId}/feedback`).withConverter<DecisionFeedback>(null);
        const feedbackQuery = query<DecisionFeedback>(feedbackCollection, orderBy('created', 'asc'));
        return collectionData(feedbackQuery);
    }

    public updateFeedback(decisionId: string, feedbackId: string, feedbackData: Partial<DecisionFeedback>): Observable<void> {
        const batch = writeBatch(this.firestore);
        batch.update(doc(this.firestore, `decisions/${decisionId}/feedback/${feedbackId}`), feedbackData);
        return from(batch.commit());
    }
}
