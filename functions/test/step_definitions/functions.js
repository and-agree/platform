const { defineStep } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

defineStep(/^calling the "([^"]*)" function with:$/, async function (functionName, data) {
    const request = this.parseObjectData(data.rowsHash());
    this.response = await this.callFunction(functionName, request);
});

defineStep(/^calling the "([^"]*)" endpoint with file "([^"]*)"$/, async function (functionName, requestFile) {
    const request = fs.readFileSync(path.join(__dirname, '..', 'mocks', requestFile)).toString();
    this.response = await this.callEndpoint(functionName, request);
});

defineStep(/^call the "([^"]*)" create function with:$/, async function (functionName, data) {
    const params = this.parseObjectData(data.rowsHash());
    this.response = await this.callCreate(functionName, { params });
});
