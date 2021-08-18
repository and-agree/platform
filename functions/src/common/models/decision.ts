import * as admin from 'firebase-admin';

export interface Decision {
    uid: string;
    destination: string[];
    subject: string;
    body: string;
    status: 'CREATED' | 'PENDING' | 'COMPLETE' | 'ARCHIVED';
    created: admin.firestore.Timestamp;
}
