const projectId = 'andagree-testing';
process.env.GCP_PROJECT = projectId;
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

const fetch = require('node-fetch');
const { setWorldConstructor } = require('@cucumber/cucumber');
const { initializeAdminApp } = require('@firebase/testing');

const testApp = require('firebase-functions-test')({ projectId });

class World {
    constructor() {
        this.storage = {};
        this.mocks = [];
        this.firestore = initializeAdminApp({ projectId }).firestore();
        this.functions = require('../../lib/index.js');
        this.setConfig({
            website: { uri: 'https://test.andagree.com' },
            sendgrid: { api_key: 'SG.xxxxxxxxxx', domain: 'ci.andagree.com' },
        });
    }

    setConfig(config) {
        testApp.mockConfig(config);
    }

    addMock(mock) {
        this.mocks = [...this.mocks, mock];
    }

    parseTemplate(string) {
        let parsed = string;
        const template = parsed.match(/{{\s?(\S*)\s?}}/);

        if (template instanceof Array) {
            const fields = template[1].split('.');
            const scope = fields.shift();
            parsed = this.storage[scope];

            parsed = fields.reduce((current, next) => {
                const array = next.match(/\[(\d+)\]/);
                if (array instanceof Array) {
                    const field = next.replace(array[0], '');
                    return current[field][parseInt(array[1], 10) - 1];
                } else {
                    return current[next];
                }
            }, parsed);

            parsed = parsed.replace(template[0], this.storage[template[1]]);
            parsed = this.parseTemplate(parsed);
        }

        return parsed;
    }

    parseObjectData(data) {
        Object.keys(data).map((key) => {
            data[key] = this.parseTemplate(data[key]);

            try {
                data[key] = JSON.parse(data[key]);
            } catch (ex) {}
        });
        return data;
    }

    async callEndpoint(endpoint, data) {
        const result = await fetch(endpoint, {
            headers: { 'Content-Type': 'multipart/form-data; charset=utf-8; boundary=xYzZY' },
            method: 'POST',
            body: data,
        });

        for (let mock of this.mocks) {
            mock.done();
        }

        this.response = result;
        return result;
    }

    async callTrigger(name, params) {
        const result = await testApp.wrap(this.functions[name])(undefined, params);

        for (let mock of this.mocks) {
            mock.done();
        }

        this.response = result;
        return result;
    }

    async callFunction(name, payload) {
        const result = await testApp.wrap(this.functions[name])(payload);

        for (let mock of this.mocks) {
            mock.done();
        }

        this.response = result;
        return result;
    }
}

setWorldConstructor(World);
