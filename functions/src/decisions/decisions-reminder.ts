import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Decision } from '../common/models';
import { SendgridEmailService } from '../services';

export const DecisionReminder = functions
    .region('europe-west2')
    .runWith({
        memory: '256MB',
        timeoutSeconds: 30,
    })
    .https.onCall(async (data) => {
        const decisionRef = await admin.firestore().collection('decisions').doc(data.decisionId);
        const decisionData = (await decisionRef.get()).data() as Decision;

        if (!decisionData) {
            functions.logger.warn('No decision entry found', data.decisionId);
            return;
        }

        if (decisionData.status !== 'PENDING') {
            return;
        }

        const sendgridEmailService = new SendgridEmailService(decisionData, 'decision-create.html');
        const recipients = decisionData.deciders.map((member) => member.email);

        try {
            await sendgridEmailService.send(recipients);
        } catch (error: any) {
            functions.logger.error('Failed to send email', error.message);
        }
    });
