import { Timestamp } from '@angular/fire/firestore';

export type DecisionFeedback = 'UNDEFINED' | 'APPROVED' | 'REJECTED';
export type DecisionStatus = 'CREATED' | 'PENDING' | 'ARCHIVED';

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
    response: DecisionFeedback;
}

export interface DecisionDocument {
    name: string;
    file: string;
    attach?: boolean;
}

export interface DecisionResponse {
    uid: string;
    from: string;
    body: string;
    response: DecisionFeedback;
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
