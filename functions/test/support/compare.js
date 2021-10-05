const { expect } = require("chai");

const checkValues = (expected, actual, exact = true) => {
	const expectedKeys = Object.keys(expected);
	const actualKeys = Object.keys(actual);

	expect(actualKeys, "Response keys do not match expectation").to[exact ? "have" : "contain"].members(expectedKeys);

	expectedKeys.map((key) => {
		let check;
		if (typeof expected[key] === "string") {
			check = expected[key].match(/\[([^\]]*)\]/) || expected[key];
			if (check instanceof Array) {
				expected[key] = expected[key].replace(check[0], "");
			}
		}

		const errorMessage = `Error on "${key}" field`;

		switch (expected[key]) {
			case "NULL":
				expect(actual[key], errorMessage).to.be.null;
				break;
			case "STRING":
				expect(actual[key], errorMessage).to.be.a("string");
				if (check instanceof Array) {
					expect(actual[key], errorMessage).to.have.length(check[1]);
				}
				break;
			case "NUMBER":
				expect(actual[key], errorMessage).to.be.a("number");
				break;
			case "ARRAY":
				expect(actual[key], errorMessage).to.be.an.instanceof(Array);
				if (check instanceof Array) {
					expect(actual[key], errorMessage).to.have.length(check[1]);
				}
				break;
			case "OBJECT":
				expect(actual[key], errorMessage).to.be.an("object");
				if (check instanceof Array) {
					expect(actual[key], errorMessage).to.have.keys(check[1].split(","));
				}
				break;
			case "DATETIME":
				expect(actual[key], errorMessage).to.match(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/);
				break;
			default:
				expect(actual[key], errorMessage).to.deep.equal(expected[key]);
		}
	});
};

module.exports = checkValues;
