const {CheckIfPasswordsMatch, ValidateEmail , ValidateDetails} = require('./register')

test("Testing whether the Passwords Match :  ", () => {
    expect(CheckIfPasswordsMatch("KingCobra","KingCobra")).toBe(true);
});

test("Testing whether the Passwords don't Match :  ", () => {
    expect(CheckIfPasswordsMatch("KingCobras","KingCobra")).toBe(false);
});

test("Testing whether the email is correctly formatted", () => {
    expect(ValidateEmail("james@gmail.com")).toBe(true);
});

test("Testing whether the email is badly formatted", () => {
    expect(ValidateEmail("james/@/gmail.com")).toBe(false);
});