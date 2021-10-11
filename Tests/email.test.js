const EmailTest = require("../email")

test("Testing Cancel Email Booking", () =>{
    let str = EmailTest.generateCancelEmailTemplate("Mike","01/01/2021");
    expect(str.length).toBeGreaterThanOrEqual(1);
})

test("Testing Doctor Booking Email Booking", () =>{
    let str = EmailTest.DGenerateBookingEmailTemplate("Mike","Larus","01/01/2021","06:00");
    expect(str.length).toBeGreaterThanOrEqual(1);
})

test("Testing Cancel Email Booking", () =>{
    let str = EmailTest.PGenerateBookingEmailTemplate("Mike","Larus","01/01/2021","06:00");
    expect(str.length).toBeGreaterThanOrEqual(1);
})

test("Testing the Date to Day Conversion", ()=>{
    let Day = EmailTest.convertDate("11/10/2021");
    expect(Day).toEqual("Monday");
})