import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { firstValueFrom, forkJoin, from, of } from 'rxjs';
import { catchError, defaultIfEmpty, mergeMap } from 'rxjs/operators';
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

        if (!['CREATED'].includes(decisionData.status)) {
            return;
        }

        const sendgridEmailService = new SendgridEmailService(decisionData, 'decision-create.html');
        const recipients = [...decisionData.managers, ...decisionData.deciders].map((member) => member.email);
        const attachmentData = sendgridEmailService.getAttachments(decisionData.documents);

        await firstValueFrom(
            forkJoin(attachmentData).pipe(
                defaultIfEmpty([]),
                mergeMap((attachments) => sendgridEmailService.send(recipients, attachments)),
                mergeMap(() => {
                    const batch = admin.firestore().batch();
                    batch.update(decisionRef, { status: 'PENDING' });
                    return from(batch.commit());
                }),
                catchError((error) => of(functions.logger.error('Decision create failed', JSON.stringify(error))))
            )
        );
    });
