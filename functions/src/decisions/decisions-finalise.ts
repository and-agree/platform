import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { send, setApiKey } from '@sendgrid/mail';
import { render } from 'ejs';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as fs from 'fs';
import * as path from 'path';
import { Decision } from '../common/models';

const emailTemplate = (template: string): string => {
    return fs.readFileSync(path.join(__dirname, 'templates', template)).toString();
};

export const DecisionFinalise = functions
    .region('europe-west2')
    .runWith({
        memory: '256MB',
        timeoutSeconds: 30,
    })
    .https.onCall(async (data) => {
        setApiKey(functions.config().sendgrid.api_key);
        const emailDomain = functions.config().sendgrid.domain;

        const decisionRef = await admin.firestore().collection('decisions').doc(data.decisionId);

        const decision = (await decisionRef.get()).data() as Decision;

        if (decision.status === 'ARCHIVED') {
            return;
        }

        const to = decision.deciders.map((decider) => decider.email);
        const from = `andAgree <${decision.uid}@${emailDomain}>`;
        const subject = decision.title;
        const html = await render(emailTemplate('decision-result.html'), { ...decision, ...data });

        const payload: MailDataRequired = { to, from, subject, html };

        try {
            await send(payload);
        } catch (error: any) {
            throw new functions.https.HttpsError('internal', error.message);
        }

        const batch = admin.firestore().batch();
        batch.update(decisionRef, { completed: admin.firestore.FieldValue.serverTimestamp(), conclusion: data.conclusion, status: 'ARCHIVED' });

        try {
            await batch.commit();
        } catch (error: any) {
            throw new functions.https.HttpsError('data-loss', error.message);
        }
    });
