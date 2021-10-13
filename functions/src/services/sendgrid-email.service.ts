import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { send, setApiKey } from '@sendgrid/mail';
import { render } from 'ejs';
import * as functions from 'firebase-functions';
import * as fs from 'fs';
import moment from 'moment';
import * as path from 'path';
import { Decision } from '../common/models';

export interface DecisionEmailModel {
    decisionData: Decision;
    emailTemplate: string;
}

export class SendgridEmailService implements DecisionEmailModel {
    private emailDomain = functions.config().sendgrid.domain;

    constructor(public decisionData: Decision, public emailTemplate: string) {}

    public loadTemplate(template: string): string {
        return fs.readFileSync(path.join(__dirname, 'templates', template)).toString();
    }

    public async send(to: string[]): Promise<void> {
        setApiKey(functions.config().sendgrid.api_key);

        const uri = functions.config().website.uri;
        const from = `&agree <${this.decisionData.uid}@${this.emailDomain}>`;
        const subject = this.decisionData.title;
        const html = await render(this.loadTemplate(this.emailTemplate), { ...this.decisionData, uri, from, moment });

        const payload: MailDataRequired = { to, from, subject, html };
        await send(payload);
    }
}
