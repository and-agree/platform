import * as admin from 'firebase-admin';

admin.initializeApp();

export * from './decisions/decisions-create';
export * from './decisions/decisions-parse';
