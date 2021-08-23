// const firebase = require("firebase/app")

// Appointment list
let appList = document.getElementById("appList");

function AddtoHtml(app,appList){

    let label;
    switch (app.status){
        case "accepted":
            label = "<span class='accept'>" + app.status + "</span>";
            break;
        case "rejected":
            label = "<span class='reject'>" + app.status + "</span>";
            break;
        case "pending":
            label = "<span class='pending' >" + app.status + "</span>";
            break;
        case "completed":
            label = "<span class='completed' >" + app.status + "</span>";
            break;
    }

    appList.innerHTML +=
        "<div class = 'card' >" +
        label +
        "<h2>Appointment with " + app.patient_Name + "</h2>" +
        "<p>" + app.date_for_appointment + " - " + app.time_for_appointment + "</p>" +
        "<table>" +
        "<tr>" +
        "<th>Reason for appointment: </th>" +
        "<td>" + app.reason_for_appointment + "</td>" +
        "</tr>" +
        "<tr>" +
        "<th>Appointment status: </th>" +
        "<td>" + app.status + "</td>" +
        "</tr>" +
        "</table>"
        + "<div>"
        +"<br/>"
    ;
}


const getAppointmentDetails = async (uid, appList) => {

    let success = false;
    let database = firebase.database();
    let ref = database.ref().child('Appointments');

    let test = await ref.orderByKey().once("value", snapshot => {
        if (snapshot.exists()) {
            success = true;
            snapshot.forEach(function (childSnapshot) {
                let app = childSnapshot.val();
                if (uid === app.doctorUid) {
                    AddtoHtml(app, appList);
                }
            });
        }
    }).then()

    return success;
}

function updatemenu() {
    if (document.getElementById('responsive-menu').checked === true) {
        document.getElementById('menu').style.borderBottomRightRadius = '0';
        document.getElementById('menu').style.borderBottomLeftRadius = '0';
    }
    else{
        document.getElementById('menu').style.borderRadius = '0px';
    }
}

module.exports = {getAppointmentDetails,AddtoHtml,updatemenu};