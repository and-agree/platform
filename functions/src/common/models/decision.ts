import * as admin from 'firebase-admin';

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

export interface DecisionTeam {
    deciders: TeamDecider[];
    managers?: string[];
    viewers?: string[];
}

export interface DecisionDocuments {
    decision: string;
    information: string;
}

export interface Decision {
    uid: string;
    general: DecisionGeneral;
    team: DecisionTeam;
    documents: DecisionDocuments;
    status: 'CREATED' | 'PENDING' | 'COMPLETE' | 'ARCHIVED';
    created: admin.firestore.Timestamp;
    companyId: string;
}
