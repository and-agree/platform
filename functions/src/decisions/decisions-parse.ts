import Busboy from 'busboy';
import * as functions from 'firebase-functions';
import { DecisionFeedbackService, EmailFields, SendgridEmailService } from '../services';

export const DecisionParse = functions
    .region('europe-west2')
    .runWith({
        memory: '256MB',
        timeoutSeconds: 30,
    })
    .https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
        if (req.method !== 'POST') {
            res.status(405).send();
            return;
        }

        try {
            const busboy = new Busboy({ headers: req.headers });
            const decisionFeedbackService: DecisionFeedbackService = new DecisionFeedbackService();

            busboy.on('field', (fieldname: EmailFields, value: string) => (decisionFeedbackService[fieldname] = value));

            busboy.on('finish', async () => {
                const decisionData = await decisionFeedbackService.save();

                if (decisionData?.responses === 100) {
                    const sendgridEmailService = new SendgridEmailService(decisionData, 'decision-ready.html');
                    const recipients = decisionData.managers.map((member) => member.email);

                    try {
                        await sendgridEmailService.send(recipients);
                    } catch (error: any) {
                        functions.logger.error('Failed to send email', error.message);
                    }
                }

                res.status(202).send();
            });

            busboy.end(req.rawBody);
        } catch (error: any) {
            functions.logger.error('Failed to update decision', error.message);
        }
    });
