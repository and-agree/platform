const { date, internet, lorem, random } = require('faker');

const generateDecision = (companyId) => {
    return {
        uid: random.alphaNumeric(24),
        companyId: companyId,
        general: {
            title: lorem.words(5),
            goal: lorem.words(8),
            background: lorem.paragraph(8),
            instructions: lorem.paragraph(2),
            deadline: date.soon(2),
        },
        team: {
            deciders: [
                {
                    email: internet.email(),
                    pending: true,
                    response: 'UNKNOWN',
                },
            ],
        },
        documents: {
            decision: internet.url(),
            information: internet.url(),
        },
        status: 'CREATED',
    };
};

module.exports = generateDecision;
