import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { send, setApiKey } from '@sendgrid/mail';
import { render } from 'ejs';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as fs from 'fs';
import * as path from 'path';
import { Decision } from '../common/models/decision';

const emailTemplate = (template: string): string => {
    return fs.readFileSync(path.join(__dirname, 'templates', template)).toString();
};

export const DecisionCreate = functions
    .region('europe-west2')
    .runWith({
        memory: '256MB',
        timeoutSeconds: 30,
    })
    .firestore.document('/decisions/{decisionId}')
    .onCreate(async (snapshot, context): Promise<void> => {
        setApiKey(functions.config().sendgrid.api_key);
        const emailDomain = functions.config().sendgrid.domain;

        const decisionRef = admin.firestore().collection('decisions').doc(context.params.decisionId);
        const decisionData = (await decisionRef.get()).data() as Decision;

        const to = decisionData.team.deciders.map((decider) => decider.email);
        const from = `andAgree <${decisionData.uid}@${emailDomain}>`;
        const subject = decisionData.general.title;
        const html = await render(emailTemplate('decision.html'), { ...decisionData.general });

        const payload: MailDataRequired = { to, from, subject, html };

        try {
            await send(payload);
        } catch (error: any) {
            throw new functions.https.HttpsError('internal', error.message);
        }

        const batch = admin.firestore().batch();
        batch.update(decisionRef, { status: 'PENDING' });

        try {
            await batch.commit();
        } catch (error: any) {
            throw new functions.https.HttpsError('data-loss', error.message);
        }
    });
