import * as admin from 'firebase-admin';

export type EmailFields = 'to' | 'from' | 'subject' | 'html' | 'text';

export interface DecisionResponseModel {
    to: string;
    from: string;
    subject: string;
    html: string;
    text: string;
}

export class DecisionResponseService implements DecisionResponseModel {
    public to = '';
    public from = '';
    public subject = '';
    public html = '';
    public text = '';

    public async save(): Promise<void> {
        const decisionId = this.to.split('@')[0];
        const from = this.from;
        const body = this.text
            .split('\n')
            .filter((line) => !line.startsWith('>'))
            .map((line) => line.trim())
            .join('\n')
            .trim();
        const created = admin.firestore.FieldValue.serverTimestamp();

        const decisionRef = await admin.firestore().collection('decisions').doc(decisionId);
        const responseRef = decisionRef.collection('responses').doc();

        const batch = admin.firestore().batch();
        batch.set(responseRef, { from, body, created });
        batch.update(decisionRef, { responseCount: admin.firestore.FieldValue.increment(1) });
        await batch.commit();
    }
}
