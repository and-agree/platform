const { internet, name, random } = require('faker');

const generateUser = () => {
    return {
        uid: random.alphaNumeric(24),
        alias: name.firstName(),
        email: internet.email(),
        companyId: random.alphaNumeric(24),
    };
};

module.exports = generateUser;
