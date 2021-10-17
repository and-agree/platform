import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { firstValueFrom, forkJoin, from, of } from 'rxjs';
import { catchError, defaultIfEmpty, mergeMap } from 'rxjs/operators';
import { Decision } from '../common/models';
import { SendgridEmailService } from '../services';

export const DecisionFinalise = functions
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

        if (['ARCHIVED', 'DELETED'].includes(decisionData.status)) {
            return;
        }

        const update = {
            documents: data.documents ?? [],
            conclusion: data.conclusion,
            status: 'ARCHIVED',
            completed: admin.firestore.FieldValue.serverTimestamp(),
        };

        const sendgridEmailService = new SendgridEmailService({ ...decisionData, ...data }, 'decision-finalise.html');
        const recipients = [...decisionData.managers, ...decisionData.deciders].map((member) => member.email);
        const attachmentData = sendgridEmailService.getAttachments(update.documents, true);

        await firstValueFrom(
            forkJoin(attachmentData).pipe(
                defaultIfEmpty([]),
                mergeMap((attachments) => sendgridEmailService.send(recipients, attachments)),
                mergeMap(() => {
                    const batch = admin.firestore().batch();
                    batch.update(decisionRef, update);
                    return from(batch.commit());
                }),
                catchError((error) => of(functions.logger.error('Decision finalise failed', error.message)))
            )
        );
    });
