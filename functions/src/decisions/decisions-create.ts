import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Decision } from '../common/models/decision';
import { SendgridEmailService } from '../services';

export const DecisionCreate = functions
    .region('europe-west2')
    .runWith({
        memory: '256MB',
        timeoutSeconds: 30,
    })
    .firestore.document('/decisions/{decisionId}')
    .onCreate(async (snapshot, context): Promise<void> => {
        const decisionRef = admin.firestore().collection('decisions').doc(context.params.decisionId);
        const decisionData = (await decisionRef.get()).data() as Decision;

        if (!decisionData) {
            functions.logger.warn('No decision entry found', context.params.decisionId);
            return;
        }

        const sendgridEmailService = new SendgridEmailService(decisionData, 'decision-create.html');
        const recipients = [...decisionData.managers, ...decisionData.deciders].map((member) => member.email);

        try {
            await sendgridEmailService.send(recipients);
        } catch (error: any) {
            functions.logger.error('Failed to send email', error.message);
        }

        const batch = admin.firestore().batch();
        batch.update(decisionRef, { status: 'PENDING' });

        try {
            await batch.commit();
        } catch (error: any) {
            functions.logger.error('Failed to update decision', error.message);
        }
    });
