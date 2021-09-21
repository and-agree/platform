import { FieldValue, Timestamp } from '@angular/fire/firestore';

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

export interface DecisionTeam {
    deciders: TeamDecider[];
    managers?: string[];
    viewers?: string[];
}

export interface DecisionDocuments {
    decision: string;
    information: string;
}

export interface DecisionResponse {
    from: string;
    body: string;
    created: Timestamp;
}

export interface Decision {
    uid: string;
    general: DecisionGeneral;
    team: DecisionTeam;
    documents: DecisionDocuments;
    responses?: DecisionResponse[];
    status: 'CREATED' | 'PENDING' | 'COMPLETE' | 'ARCHIVED';
    created: Timestamp | FieldValue;
    companyId: string;
}
