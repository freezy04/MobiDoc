const firebase = require('firebase/app').default;
require('firebase/auth');
require('firebase/database');



beforeAll(() => {

    let firebaseConfig = {
        apiKey: "AIzaSyB-ckD1wmZWj5c7RQIOyBvwFmQApBfEEMU",
        authDomain: "mobidoc-6a3ac.firebaseapp.com",
        databaseURL: "https://mobidoc-6a3ac-default-rtdb.firebaseio.com/",
        projectId: "mobidoc-6a3ac",
        storageBucket: "mobidoc-6a3ac.appspot.com",
        messagingSenderId: "311373483549",
        appId: "1:311373483549:web:3c840b29b14029ac4680f4",
        measurementId: "G-JFPKMPTGZ5"
    };

    const firebase = require("firebase");
    const admin = require("firebase-admin");

    admin.initializeApp(firebaseConfig);
    firebase.initializeApp(firebaseConfig);
    //
    firebase.auth();


    document.body.innerHTML =
        "<div>" +
        "<dl id='appList'>" +
        "</dl>" + "</div>";

});

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

test("Testing that the different appointments are sent to the HTML DOM Accepted", () =>{
    // setting fake env
    document.body.innerHTML =
        "<div>" +
        "<dl id='appList'>" +
        "</dl>" + "</div>";
    // creating fake data
    let app = {status : "accepted",
        patient_name : "Test Patient" ,
        date_for_appointment : "11/01/2020",
        time_for_appointment : "10",
        reason_for_appointment : "Sick and Tired of bad music" }
    //
    let appList = document.getElementById("appList");
    Appoint.AddtoHtml(app,appList);
    let length = document.getElementById("appList").innerHTML.length;

    expect(length).toBeGreaterThan(0);
})

test("Testing that the different appointments are sent to the HTML DOM Rejected", () =>{
    document.body.innerHTML =
        "<div>" +
        "<dl id='appList'>" +
        "</dl>" + "</div>";
    let app = {status : "rejected",
        patient_name : "Test Patient" ,
        date_for_appointment : "11/01/2020",
        time_for_appointment : "10",
        reason_for_appointment : "Sick and Tired of bad music" }
    let appList = document.getElementById("appList");
    Appoint.AddtoHtml(app,appList);
    let length = document.getElementById("appList").innerHTML.length;

    expect(length).toBeGreaterThan(0);
})

test("Testing that the different appointments are sent to the HTML DOM Completed", () =>{
    document.body.innerHTML =
        "<div>" +
        "<dl id='appList'>" +
        "</dl>" + "</div>";
    let app = {status : "completed",
        patient_name : "Test Patient" ,
        date_for_appointment : "11/01/2020",
        time_for_appointment : "10",
        reason_for_appointment : "Sick and Tired of bad music" }
    let appList = document.getElementById("appList");
    Appoint.AddtoHtml(app,appList);
    let length = document.getElementById("appList").innerHTML.length;

    expect(length).toBeGreaterThan(0);
})

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

