let appList = document.getElementById("appList");

function AddtoHtml(app,appList) {

    let label;
    label = "<span class='complete'>" + app.status + "</span>";
    appList.innerHTML +=
        "<div class='card' >"+
        "<h2>Appointment with " + app.doctor_Name + "</h2>" +
        "<p>" + app.date_for_appointment + " - " + app.time_for_appointment + "</p>" +
        "<table>" +
        "<tr>" +
        "<th>Appointment notes: </th>" +
        "<td>" + app.notes + "</td>" +
        "</tr>" +
        "<tr>" +
        "<th>Consulation cost: </th>" +
        "<td>" + app.appointment_Cost + "</td>" +
        "</tr>" +
        "<tr>" +
        "<th>Reason for appointment: </th>" +
        "<td>" + app.reason_for_appointment + "</td>" +
        "</tr>" +
        "</table>"
        +"</div>"
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

module.exports = {AddtoHtml,updatemenu}