import * as admin from 'firebase-admin';

admin.initializeApp();

// Decision making
export * from './decisions/decisions-create';
export * from './decisions/decisions-finalise';
export * from './decisions/decisions-parse';
export * from './decisions/decisions-reminder';
// Mailchimp
export * from './mailchimp/mailchimp-subscribe';
