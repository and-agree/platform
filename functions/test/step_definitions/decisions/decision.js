const { defineStep } = require('@cucumber/cucumber');
const generateDecision = require('../../generators/decision');
const generateUser = require('../../generators/user');

defineStep(/^there is a decision created using:$/, async function (data) {
    const parsed = this.parseObjectData(data.rowsHash());

    const user = generateUser();
    let decision = generateDecision(user.companyId);
    decision = { ...decision, ...parsed };

    const userDoc = this.firestore.collection('users').doc(user.uid);
    await userDoc.set(user);

    const decisionDoc = this.firestore.collection('decisions').doc(decision.uid);
    await decisionDoc.set(decision);

    this.storage.user = user;
    this.storage.decision = decision;
});
