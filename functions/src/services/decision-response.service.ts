import * as admin from 'firebase-admin';

export type EmailFields = 'to' | 'from' | 'sender_ip' | 'subject' | 'html' | 'text';

export interface DecisionResponseModel {
    to: string;
    from: string;
    sender_ip: string;
    subject: string;
    html: string;
    text: string;
}

export class DecisionResponseService implements DecisionResponseModel {
    public to = '';
    public from = '';
    public sender_ip = '';
    public subject = '';
    public html = '';
    public text = '';

    public async save(): Promise<void> {
        const decisionId = this.to.split('@')[0];
        console.log(decisionId);

        const decisionRef = await admin.firestore().collection('decisions').doc(decisionId);
        const responseRef = decisionRef.collection('responses').doc();

        const batch = admin.firestore().batch();
        batch.set(responseRef, { from: this.from, ip: this.sender_ip, body: this.text, created: admin.firestore.FieldValue.serverTimestamp() });
        batch.update(decisionRef, { responseCount: admin.firestore.FieldValue.increment(1) });
        await batch.commit();
    }
}
