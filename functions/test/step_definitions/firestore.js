const { defineStep } = require('@cucumber/cucumber');
const { expect } = require('chai');
const checkValues = require('../support/compare');

defineStep(/^there is a collection "([^"]*)" with document "([^"]*)"$/, async function (collectionName, documentId) {
    const parsedId = this.parseTemplate(documentId);
    this.storage.documentRef = this.firestore.collection(collectionName).doc(parsedId);

    const document = await this.storage.documentRef.get();
    expect(document.exists, `No document for "${collectionName}" with ID "${parsedId}"`).to.be.true;
});

defineStep(/^there is a sub-collection "([^"]*)" with document "([^"]*)"$/, async function (collectionName, documentId) {
    if (!this.storage.documentRef) {
        throw new Error('No existing document reference');
    }

    const parsedId = this.parseTemplate(documentId);
    this.storage.documentRef = this.storage.documentRef.collection(collectionName).doc(parsedId);

    const document = await this.storage.documentRef.get();
    expect(document.exists, `No document for "${collectionName}" with ID "${parsedId}"`).to.be.true;
});

defineStep(/^the document contains:$/, async function (tableData) {
    if (!this.storage.documentRef) {
        throw new Error('No existing document reference');
    }

    const actualData = (await this.storage.documentRef.get()).data();
    const expectedData = this.parseObjectData(tableData.rowsHash());

    checkValues(expectedData, actualData, false);
});
