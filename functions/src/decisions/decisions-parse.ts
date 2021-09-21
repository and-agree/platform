import Busboy from 'busboy';
import * as functions from 'firebase-functions';
import { DecisionResponseService, EmailFields } from '../services';

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
            const decisionResponse: DecisionResponseService = new DecisionResponseService();

            busboy.on('field', (fieldname: EmailFields, value: string) => (decisionResponse[fieldname] = value));

            busboy.on('finish', async () => {
                await decisionResponse.save();
                res.status(202).send();
            });

            busboy.end(req.rawBody);
        } catch (error: any) {
            throw new functions.https.HttpsError('internal', error.message);
        }
    });
