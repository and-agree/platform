const { date, internet, lorem, random } = require('faker');

const generateDecision = (companyId) => {
    return {
        uid: random.alphaNumeric(24),
        companyId: companyId,
        title: lorem.words(5),
        goal: lorem.words(8),
        background: lorem.paragraph(8),
        instructions: lorem.paragraph(2),
        deadline: date.soon(2),
        managers: [{ uid: random.alphaNumeric(24), email: internet.email() }],
        deciders: [
            {
                email: internet.email(),
                pending: true,
                status: 'UNDEFINED',
            },
        ],
        viewers: [{ uid: random.alphaNumeric(24), email: internet.email() }],
        viewers: [{ uid: random.alphaNumeric(24), email: internet.email() }],
        documents: [
            {
                name: random.alpha(15),
                file: internet.url(),
            },
        ],
        creator: { uid: random.alphaNumeric(24), email: internet.email() },
        status: 'CREATED',
    };
};

module.exports = generateDecision;
