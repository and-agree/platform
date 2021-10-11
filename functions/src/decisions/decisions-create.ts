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

        if (!decisionData) {
            functions.logger.warn('No decision entry found', context.params.decisionId);
        }

        const to = decisionData.deciders.map((decider) => decider.email);
        const from = `&agree <${decisionData.uid}@${emailDomain}>`;
        const subject = decisionData.title;
        const html = await render(emailTemplate('decision-create.html'), { ...decisionData, from });

        const payload: MailDataRequired = { to, from, subject, html };

        try {
            await send(payload);
        } catch (error: any) {
            functions.logger.warn('Failed to send decision email', error.message);
        }

        const batch = admin.firestore().batch();
        batch.update(decisionRef, { status: 'PENDING' });

        try {
            await batch.commit();
        } catch (error: any) {
            functions.logger.error('Failed to update decision', error.message);
        }
    });
