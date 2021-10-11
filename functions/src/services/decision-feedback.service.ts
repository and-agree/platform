import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Decision, DecisionFeedbackStatus, TeamDecider } from '../common/models';

export type EmailFields = 'to' | 'from' | 'subject' | 'html' | 'text';

export interface EmailEnvelope {
    to: string[];
    from: string;
}

export interface DecisionFeedbackModel {
    to: string;
    from: string;
    envelope: string;
    subject: string;
    html: string;
    text: string;
}

export class DecisionFeedbackService implements DecisionFeedbackModel {
    public to = '';
    public from = '';
    public subject = '';
    public html = '';
    public text = '';

    private _envelope: EmailEnvelope = { to: [''], from: '' };

    get envelope(): string {
        return JSON.stringify(this._envelope);
    }
    set envelope(envelope: string) {
        this._envelope = JSON.parse(envelope);
    }

    public async save(): Promise<void> {
        const to = this._envelope.to.find((to: string) => to.endsWith(functions.config().sendgrid.domain));

        if (!to) {
            throw new Error('Cannot find valid decision email address');
        }

        const decisionId = to.split('@')[0];
        const from = this._envelope.from;
        const body = this.text
            .split('\n')
            .filter((line) => !line.startsWith('>'))
            .map((line) => line.trim())
            .join('\n')
            .trim();
        const created = admin.firestore.FieldValue.serverTimestamp();

        const decisionRef = await admin.firestore().collection('decisions').doc(decisionId);
        const feedbackRef = decisionRef.collection('feedback').doc();

        const decisionData = (await decisionRef.get()).data() as Decision;

        if (!decisionData) {
            functions.logger.warn('No decision entry found', decisionId);
            throw new Error(`${decisionId} not found`);
        }

        const words = body
            .split('\n')
            .reduce((words: string[], line: string) => [...words, ...line.split(' ')], [])
            .filter(Boolean)
            .map((word) => word.toLowerCase());

        const approved = ['agree', 'approved', 'approve'].some((word) => words.includes(word));
        const rejected = ['disagree', 'rejected', 'reject'].some((word) => words.includes(word));
        let status: DecisionFeedbackStatus = 'UNDEFINED';

        if (approved && !rejected) {
            status = 'APPROVED';
        }

        if (rejected && !approved) {
            status = 'REJECTED';
        }

        decisionData.deciders = decisionData.deciders.map((decider: TeamDecider): TeamDecider => {
            if (decider.email === from) {
                decider.pending = false;
                decider.status = status;
            }
            return decider;
        });

        decisionData.responses = (decisionData.deciders.filter((decider: TeamDecider) => !decider.pending).length / decisionData.deciders.length) * 100;

        const batch = admin.firestore().batch();
        batch.set(feedbackRef, { uid: feedbackRef.id, from, body, status, created });
        batch.set(decisionRef, decisionData);
        await batch.commit();
    }
}
