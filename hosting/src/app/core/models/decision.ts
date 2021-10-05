import { Timestamp } from '@angular/fire/firestore';

export type DecisionStatus = 'CREATED' | 'PENDING' | 'COMPLETE' | 'ARCHIVED';
export interface DecisionGeneral {
    title: string;
    goal: string;
    background: string;
    instructions: string;
    deadline: Timestamp;
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
    created: Timestamp;
}

export interface Decision extends DecisionGeneral {
    uid: string;
    deciders: TeamDecider[];
    documents: DecisionDocument[];
    responses?: DecisionResponse[];
    feedback: number;
    conclusion?: string;
    status: DecisionStatus;
    created: Timestamp;
    completed?: Timestamp;
    companyId: string;
}
