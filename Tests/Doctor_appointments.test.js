const Appoint = require("../Doctor/scripts/Appointments")

// test("Fetching data from Firebase", async () =>{
//     // creating the DOM Element
//     document.body.innerHTML =
//         "<div>" +
//         "<dl id='appList'>" +
//         "</dl>" + "</div>";
//     let appList = document.getElementById("appList");
//     let DocUID = "gwx5hKK8dvbqKJILWlT2qrUMoRD3";
//
//     await Appoint.getAppointmentDetails(DocUID,appList);
//     let promise = Promise.resolve(Appoint.getAppointmentDetails(DocUID,appList))
//     promise.then(function(val) {
//         expect(appList.innerHTML).toBeGreaterThan(0);
//     });
//
// });

test("Testing that the different appointments are sent to the HTML DOM Pending", () =>{
    document.body.innerHTML =
        "<div>" +
        "<dl id='appList'>" +
        "</dl>" + "</div>";
    let app = {status : "pending",
        patient_name : "Test Patient" ,
        date_for_appointment : "11/01/2020",
        time_for_appointment : "10",
        reason_for_appointment : "Sick and Tired of bad music" }
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

