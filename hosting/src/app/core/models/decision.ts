import { Timestamp } from '@angular/fire/firestore';

export type DecisionFeedbackStatus = 'UNDEFINED' | 'APPROVED' | 'REJECTED';
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
    status: DecisionFeedbackStatus;
}

export interface DecisionDocument {
    name: string;
    file: string;
    attach?: boolean;
}

export interface DecisionFeedback {
    uid: string;
    from: string;
    body: string;
    status: DecisionFeedbackStatus;
    created: Timestamp;
}

export interface Decision extends DecisionGeneral {
    uid: string;
    deciders: TeamDecider[];
    documents: DecisionDocument[];
    feedback?: DecisionFeedback[];
    responses: number;
    conclusion?: string;
    status: DecisionStatus;
    created: Timestamp;
    completed?: Timestamp;
    companyId: string;
}
