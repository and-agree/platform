import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

export const MailchimpSubscribe = functions
    .region('europe-west2')
    .runWith({
        memory: '256MB',
        timeoutSeconds: 30,
    })
    .https.onCall(async (data) => {
        const apiUri = functions.config().mailchimp.api_uri;
        const apiKey = functions.config().mailchimp.api_key;
        const listId = functions.config().mailchimp.list_id;

        const uri = `${apiUri}/lists/${listId}/members`;
        const method = 'POST';
        const headers = {
            Authorization: `Bearer ${apiKey}`,
        };

        // eslint-disable-next-line camelcase
        const body = JSON.stringify({ email_address: data.email.toLowerCase(), status: data.status });

        try {
            const response = await fetch(uri, { method, headers, body });
            const result = await response.json();
            if (result.status >= 400) {
                if (result.errors) {
                    throw new Error(result.errors.map((error: any) => `${error.message} [${error.field}]`).join(', '));
                } else {
                    throw new Error(result.detail);
                }
            }
        } catch (error: any) {
            functions.logger.error('Mailchimp subscribe failed.', error.message);
        }
    });
