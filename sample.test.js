const PasswordCheck = require('./register.js');

test("Some Testing",() =>{
    let ans = PasswordCheck("yes","yes");
    expect(ans).toBe(true);
})
