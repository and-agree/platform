import * as admin from 'firebase-admin';

export type DecisionStatus = 'CREATED' | 'PENDING' | 'COMPLETE' | 'ARCHIVED';

export interface DecisionGeneral {
    title: string;
    goal: string;
    background: string;
    instructions: string;
    deadline: admin.firestore.Timestamp;
}

export interface TeamDecider {
    email: string;
    pending: boolean;
    response: 'UNKNOWN' | 'APPROVED' | 'REJECTED';
}

export interface DecisionDocument {
    name: string;
    file: string;
    attach?: boolean;
}

export interface DecisionResponse {
    from: string;
    body: string;
    created: admin.firestore.Timestamp;
}

export interface Decision {
    uid: string;
    general: DecisionGeneral;
    deciders: TeamDecider[];
    documents: DecisionDocument[];
    responses?: DecisionResponse[];
    conclusion?: string;
    status: DecisionStatus;
    created: admin.firestore.Timestamp;
    companyId: string;
}
