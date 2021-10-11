var buttons = document.querySelectorAll('dl');

for (var i=0; i<buttons.length; ++i) {
    buttons[i].addEventListener('click', clickFunc);
}

function clickFunc() {
    alert(this.id);
}

// Appointment list
let appList = document.getElementById("appList");

function AddtoHtml(app,appList){

    let label;
    switch (app.status){

        case "canceled":
            label = "<span class='canceled' >" + app.status + "</span>";
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


function updatemenu() {
    if (document.getElementById('responsive-menu').checked === true) {
        document.getElementById('menu').style.borderBottomRightRadius = '0';
        document.getElementById('menu').style.borderBottomLeftRadius = '0';
    }
    else{
        document.getElementById('menu').style.borderRadius = '0px';
    }
}

module.exports = {AddtoHtml,updatemenu};