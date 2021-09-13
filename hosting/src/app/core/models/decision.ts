import { FieldValue } from '@angular/fire/firestore';

export interface Decision {
    uid: string;
    destination: string[];
    subject: string;
    body: string;
    status: 'CREATED' | 'PENDING' | 'COMPLETE' | 'ARCHIVED';
    created: FieldValue;
}
