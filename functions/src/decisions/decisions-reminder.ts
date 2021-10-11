import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { send, setApiKey } from '@sendgrid/mail';
import { render } from 'ejs';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as fs from 'fs';
import moment from 'moment';
import * as path from 'path';
import { Decision } from '../common/models';

const emailTemplate = (template: string): string => {
    return fs.readFileSync(path.join(__dirname, 'templates', template)).toString();
};

export const DecisionReminder = functions
    .region('europe-west2')
    .runWith({
        memory: '256MB',
        timeoutSeconds: 30,
    })
    .https.onCall(async (data) => {
        setApiKey(functions.config().sendgrid.api_key);
        const emailDomain = functions.config().sendgrid.domain;

        const decisionRef = await admin.firestore().collection('decisions').doc(data.decisionId);
        const decisionData = (await decisionRef.get()).data() as Decision;

        if (!decisionData) {
            functions.logger.warn('No decision entry found', data.decisionId);
            return;
        }

        if (decisionData.status !== 'PENDING') {
            return;
        }

        const to = decisionData.deciders.filter((decider) => decider.pending).map((decider) => decider.email);
        const from = `&agree <${decisionData.uid}@${emailDomain}>`;
        const subject = decisionData.title;
        const html = await render(emailTemplate('decision-create.html'), { ...decisionData, from, moment });

        const payload: MailDataRequired = { to, from, subject, html };

        try {
            await send(payload);
        } catch (error: any) {
            functions.logger.warn('Failed to send decision email', error.message);
        }
    });
