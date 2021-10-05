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

export const DecisionUpdate = functions
    .region('europe-west2')
    .runWith({
        memory: '256MB',
        timeoutSeconds: 30,
    })
    .firestore.document('/decisions/{decisionId}')
    .onUpdate(async (change): Promise<void> => {
        setApiKey(functions.config().sendgrid.api_key);
        const emailDomain = functions.config().sendgrid.domain;

        const before = change.before.data() as Decision;
        const after = change.after.data() as Decision;

        if (before.status === 'COMPLETE' || after.status !== 'COMPLETE') {
            return;
        }

        const to = after.deciders.map((decider) => decider.email);
        const from = `andAgree <${after.uid}@${emailDomain}>`;
        const subject = after.title;
        const html = await render(emailTemplate('decision-result.html'), after);

        const payload: MailDataRequired = { to, from, subject, html };

        try {
            await send(payload);
        } catch (error: any) {
            throw new functions.https.HttpsError('internal', error.message);
        }

        const batch = admin.firestore().batch();
        batch.update(change.after.ref, { status: 'ARCHIVED' });

        try {
            await batch.commit();
        } catch (error: any) {
            throw new functions.https.HttpsError('data-loss', error.message);
        }
    });
