const Appoint = require("../Patient/scripts/CompletedAppointments")

test("Testing that the different appointments are sent to the HTML DOM Completed", () =>{
    document.body.innerHTML =
        "<div>" +
        "<dl id='appList'>" +
        "</dl>" + "</div>";
    let app = {status : "completed",
        patient_name : "Test Patient" ,
        doctor_Name : "Test Doctor",
        date_for_appointment : "11/01/2020",
        time_for_appointment : "10",
        reason_for_appointment : "Sick and Tired of bad music",
        notes : "take 3 pill a day",
        appointment_Cost : "150"}
    let appList = document.getElementById("appList");
    Appoint.AddtoHtml(app,appList);
    let length = document.getElementById("appList").innerHTML.length;

    expect(length).toBeGreaterThan(0);
})

test("Update Menu where the menu is responsive", () => {
    // setting up the DOM elements
    document.body.innerHTML = "<div id='responsive-menu'></div>" +
        "<div id='menu'></div>"
    document.getElementById('responsive-menu').checked = true;
    Appoint.updatemenu();
    expect(document.getElementById('menu').style.borderBottomRightRadius).toBe("0");

});

test("Update Menu where the menu is unresponsive", () => {
    // setting up the DOM elements
    document.body.innerHTML = "<div id='responsive-menu'></div>" +
        "<div id='menu'></div>"
    document.getElementById('responsive-menu').checked = false;
    Appoint.updatemenu();
    expect(document.getElementById('menu').style.borderRadius).toBe("0px");

});