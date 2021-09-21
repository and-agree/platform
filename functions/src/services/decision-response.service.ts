import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { TeamDecider } from '../common/models';

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

        const decisionData = (await decisionRef.get()).data();

        if (!decisionData) {
            throw new Error(`${decisionId} not found`);
        }

        const approved = ['agree', 'approved', 'approve'].some((word) => body.toLowerCase().includes(word));
        const rejected = ['disagree', 'rejected', 'reject'].some((word) => body.toLowerCase().includes(word));
        let decision: 'UNKNOWN' | 'APPROVED' | 'REJECTED' = 'UNKNOWN';

        if (approved && !rejected) {
            decision = 'APPROVED';
        }

        if (rejected && !approved) {
            decision = 'REJECTED';
        }

        decisionData.team.deciders = decisionData.team.deciders.map((decider: TeamDecider): TeamDecider => {
            if (decider.email === from) {
                decider.pending = false;
                decider.response = decision;
            }
            return decider;
        });

        const batch = admin.firestore().batch();
        batch.set(responseRef, { from, body, created });
        batch.set(decisionRef, decisionData);
        await batch.commit();
    }
}
