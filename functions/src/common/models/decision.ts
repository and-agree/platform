import * as admin from 'firebase-admin';

export type DecisionFeedbackStatus = 'UNDEFINED' | 'APPROVED' | 'REJECTED';
export type DecisionStatus = 'CREATED' | 'PENDING' | 'ARCHIVED' | 'DELETED';

export interface DecisionGeneral {
    title: string;
    goal: string;
    background: string;
    instructions: string;
    deadline: admin.firestore.Timestamp;
}

export interface TeamMember {
    uid?: string;
    email: string;
}

export interface TeamDecider {
    email: string;
    pending: boolean;
    status: DecisionFeedbackStatus;
}

export interface DecisionDocument {
    name: string;
    path: string;
    size: boolean;
    approved: boolean;
}

export interface DecisionFeedback {
    uid: string;
    from: string;
    body: string;
    status: DecisionFeedbackStatus;
    created: admin.firestore.Timestamp;
}

export interface Decision extends DecisionGeneral {
    uid: string;
    managers: TeamMember[];
    deciders: TeamDecider[];
    viewers: TeamMember[];
    documents: DecisionDocument[];
    feedback?: DecisionFeedback[];
    responses: number;
    conclusion?: string;
    status: DecisionStatus;
    created: admin.firestore.Timestamp;
    creator: TeamMember;
    completed?: admin.firestore.Timestamp;
    companyId: string;
}
