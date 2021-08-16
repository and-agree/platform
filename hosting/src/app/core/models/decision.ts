import firebase from 'firebase/app';

export interface Decision {
    uid: string;
    destination: string[];
    subject: string;
    body: string;
    status: 'CREATED' | 'PENDING' | 'COMPLETE' | 'ARCHIVED';
    created: firebase.firestore.FieldValue;
}
