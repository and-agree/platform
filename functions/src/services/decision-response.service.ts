import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Decision, TeamDecider } from '../common/models';

export type EmailFields = 'to' | 'from' | 'subject' | 'html' | 'text';

export interface EmailEnvelope {
    to: string[];
    from: string;
}

export interface DecisionResponseModel {
    to: string;
    from: string;
    envelope: string;
    subject: string;
    html: string;
    text: string;
}

export class DecisionResponseService implements DecisionResponseModel {
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
        const responseRef = decisionRef.collection('responses').doc();

        const decisionData = (await decisionRef.get()).data() as Decision;

        if (!decisionData) {
            throw new Error(`${decisionId} not found`);
        }

        const words = body
            .split('\n')
            .reduce((words: string[], line: string) => [...words, ...line.split(' ')], [])
            .filter(Boolean)
            .map((word) => word.toLowerCase());

        const approved = ['agree', 'approved', 'approve'].some((word) => words.includes(word));
        const rejected = ['disagree', 'rejected', 'reject'].some((word) => words.includes(word));
        let response: 'UNDEFINED' | 'APPROVED' | 'REJECTED' = 'UNDEFINED';

        if (approved && !rejected) {
            response = 'APPROVED';
        }

        if (rejected && !approved) {
            response = 'REJECTED';
        }

        decisionData.deciders = decisionData.deciders.map((decider: TeamDecider): TeamDecider => {
            if (decider.email === from) {
                decider.pending = false;
                decider.response = response;
            }
            return decider;
        });

        decisionData.feedback = (decisionData.deciders.filter((decider: TeamDecider) => !decider.pending).length / decisionData.deciders.length) * 100;

        const batch = admin.firestore().batch();
        batch.set(responseRef, { from, body, response, created });
        batch.set(decisionRef, decisionData);
        await batch.commit();
    }
}
