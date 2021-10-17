import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { ClientResponse, send, setApiKey } from '@sendgrid/mail';
import { render } from 'ejs';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as fs from 'fs';
import moment from 'moment';
import * as path from 'path';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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

    public setData(decisionData: Decision): void {
        this.decisionData = decisionData;
    }

    public getAttachments(approved = false): Observable<any>[] {
        return this.decisionData.documents
            .filter((document) => document.approved === approved)
            .map((document) =>
                of(admin.storage().bucket()).pipe(
                    mergeMap((bucket) => of(bucket.file(document.path))),
                    mergeMap((file) => file.download({ validation: false })),
                    map((binary) => binary[0].toString('base64')),
                    map((data) => ({
                        content: data,
                        filename: document.name,
                        type: 'application/octet-stream',
                        disposition: 'attachment',
                    }))
                )
            );
    }

    public send(recipients: string[], attachments: any[] = []): Observable<[ClientResponse, Record<string, string>]> {
        setApiKey(functions.config().sendgrid.api_key);

        const uri = functions.config().website.uri;
        const to = [...new Set(recipients)];
        const from = `&agree <${this.decisionData.uid}@${this.emailDomain}>`;
        const subject = this.decisionData.title;
        const template = render(this.loadTemplate(this.emailTemplate), { ...this.decisionData, uri, from, moment });

        return of(template).pipe(
            map((html): MailDataRequired => ({ to, from, subject, html, attachments })),
            mergeMap((payload: MailDataRequired) => send(payload))
        );
    }
}
