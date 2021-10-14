
let doctorNames = {};
let appointments = [];
let appointmentsKeys = [];
let times = ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
let weekDays = [{shortDay:"Mon", fullDay:"Monday"}, {shortDay:"Tue", fullDay:"Tuesday"},
    {shortDay:"Wed", fullDay:"Wednesday"}, {shortDay:"Thu", fullDay:"Thursday"}, {shortDay:"Fri", fullDay:"Friday"},
    {shortDay:"Sat", fullDay:"Saturday"}, {shortDay:"Sun", fullDay:"Sunday"}];

function getAppointments(patID) {
    let database = firebase.database();
    let ref = database.ref().child("Appointments");
    ref.orderByKey().once("value",snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(function (childSnapshot) {
                let app = childSnapshot.val();
                let id_app = childSnapshot.key;
                if (app.patientUid === patID) {
                    appointments.push(app);
                    appointmentsKeys.push(id_app);
                    let docNames = doctorNames[app.date_for_appointment];
                    if (docNames === undefined) {
                        doctorNames[app.date_for_appointment] = app.doctor_Name;
                    } else {
                        let multAppOp = (docNames[0] === '~')  ? "" : "~";
                        doctorNames[app.date_for_appointment] = multAppOp + docNames + "~" + app.doctor_Name;
                    }
                }
            });
        }
        console.log(doctorNames);
        console.log(appointments);

        let curDate = new Date();
        let curMonth = curDate.getMonth() + 1;
        curMonth = (curMonth < 10) ? "0" + curMonth : curMonth;
        let curYear = curDate.getFullYear();
        let nextYear = curYear + 1;
        document.getElementById("calendar").innerHTML = getDatesBetween(curMonth + "/01/" + curYear, curMonth + "/01/" + nextYear);

        // Dylan Added this
        document.getElementById("loader").style.display = "none";
    });
}

let calendarShow = 0;

function settingDate(date, day) {
    date = new Date(date);
    date.setDate(day);
    date.setHours(23);
    return date;
}

function openAppsPopup(dayID) {
    document.getElementById("appsPopup").style.display = "block";
    document.getElementById("appsPopupHeader").innerText = dayID;
    let close = document.getElementsByClassName("close")[0];
    close.onclick = function() {
        document.getElementById("appsPopup_").style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target === document.getElementById("appsPopup")) {
            document.getElementById("appsPopup").style.display = "none";
        }
    }
    let content = "";
    let app;
    for (let i = 0; i < appointments.length; i++) {
        if (appointments[i].date_for_appointment === dayID) {
            app = appointments[i];
            let label;
            switch (app.status){
                case "upcoming":
                    label = "<span class='accept'>" + app.status + "</span>";
                    break;
                case "pending":
                    label = "<span class='pending' >" + app.status + "</span>";
                    break;
                case "rejected":
                    label = "<span class='reject' >" + app.status + "</span>";
                    break;
                case "canceled":
                    label = "<span class='reject' >" + app.status + "</span>";
                    break;
            }
            content +=
                "<div class = 'card'>" +
                label +
                "<h2>Appointment with " + app.doctor_Name + "</h2>" +
                "<p id='app_id' style='display:none;'>" + app.id + "</p>" +
                "<p>" + app.date_for_appointment + " - " + app.time_for_appointment + "</p>" +
                "<table class='appCard'>" +
                "<tr class='appCard'>" +
                "<th class='appCard'>Reason for appointment: </th>" +
                "<td class='appCard'>" + app.reason_for_appointment + "</td>" +
                "</tr>" +
                "</table>"
                +"</div>"
                +"<br/>";
        }
    }
    document.getElementById("dayAppCards").innerHTML = content;
    let button = document.getElementById("confirm___app_btn");
    button.addEventListener('click', function() {
        //rejectAppointment(appID);
        // #TODO Create Cancel appointment function
        openAppsPopup_(dayID)


    })
}
function openAppsPopup_(dayID) {
    document.getElementById("appsPopup").style.display = "none";
    document.getElementById("appsPopup_").style.display = "block";
    document.getElementById("appsPopupHeader_").innerText = dayID;
    let close = document.getElementsByClassName("close_")[0];
    close.onclick = function() {
        document.getElementById("appsPopup_").style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target === document.getElementById("appsPopup_")) {
            document.getElementById("appsPopup_").style.display = "none";
        }
    }

    let content = "";
    let app;
    let keys;
    for (let i = 0; i < appointments.length; i++) {
        if (appointments[i].date_for_appointment === dayID) {
            app = appointments[i];
            let label;
            keys = appointmentsKeys[i];
            switch (app.status){
                case "upcoming":
                    label = "<span class='accept'>" + app.status + "</span>";
                    content +=
                        "<div class = 'card'>" +
                        label +
                        "<h2>Appointment with " + app.doctor_Name + "</h2>" +
                        "<p id='app_id' style='display:none;'>" + app.id + "</p>" +
                        "<p>" + app.date_for_appointment + " - " + app.time_for_appointment + "</p>" +
                        "<table class='appCard'>" +
                        "<tr class='appCard'>" +
                        "<th class='appCard'>Reason for appointment: </th>" +
                        "<td class='appCard'>" + app.reason_for_appointment + "</td>" +
                        "</tr>" +
                        "<tr>"+
                        "<button class='appCard_' id='" + keys + "' onClick='openRejectAppPopup(this.id)'> Cancel </button>" +
                        //insert popup here to make it more dynamic (next sprint)
                        "</tr>" +
                        "</table>"
                        +"</div>"
                        +"<br/>";
                    break;

            }

        }
    }

    document.getElementById("dayAppCards_").innerHTML = content;


}
function validateDetails(rejection_reason) {
    //let error = document.getElementById("Error");
    if (rejection_reason === "") {
        error.style.display = "block";
        error.innerHTML = "Reason cannot be empty";
        return false;
    }
    error.style.display = "none";
    return true;
}

function updateAppointment(appID, rejection_reason) {
    let database = firebase.database();
    const d = new Date();
    let ref = database.ref().child('Appointments');
    ref.child(appID).update({"cancellation_done_by":"Patient"});
    ref.child(appID).update({"cancellation_date":d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()});
    ref.child(appID).update({"cancellation_reason":rejection_reason});
    ref.child(appID).update({"status":"canceled"});


    let popup = document.getElementById("reject_app_popup");
    popup.style.display = "none";
    document.getElementById("appsPopup_").style.display = "none";

}

function rejectAppointment(appID) {
    let rejection_reason = document.getElementById("app_rejection_reason").value;
    console.log(appID);

    if (validateDetails(rejection_reason)) {
        updateAppointment(appID, rejection_reason);
    }

}

function openRejectAppPopup(appID) {
    let popup = document.getElementById("reject_app_popup");
    let close = document.getElementsByClassName("popup-close")[0];

    let button = document.getElementById("confirm_app_btn");
    button.addEventListener('click', function() {
        rejectAppointment(appID);
        // #TODO Create Cancel appointment function

    })

    popup.style.display = "block";//opens popup

    //closes popup if user clicks close or outside popup
    close.onclick = function() {
        popup.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    }
}
function getDatesBetween(startDate, endDate) {
    let startRange = new Date(startDate);
    let endRange = new Date(endDate);

    startDate = settingDate(startDate, 31);
    endDate = settingDate(endDate, 31);

    let temp;
    let dates = [];
    while (startDate <= endDate) {
        if (startDate.getDate() !== 31) {
            temp = settingDate(startDate, 0);
            if (temp >= startRange && temp <= endRange) {
                dates.push(temp);
            }
            startDate = settingDate(startDate, 31);
        } else {
            temp = new Date(startDate);
            if (temp >= startRange && temp <= endRange) {
                dates.push(temp);
            }
            startDate.setMonth(startDate.getMonth() + 1);
        }
    }
    // console.log(dates);

    let content = "<div class='calendarBtn'><button id='calendarPrev' onclick='prevMonth()' disabled>Prev</button> | <button id='calendarNext' onclick='nextMonth()'>Next</button></div>";

    let lastDate, firstDate;
    for (let i = 0; i < dates.length; i++) {
        lastDate = dates[i];
        firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
        content += "<div id='calendarTable_" + i + "' class='calendarDiv'>";
        content += "<h2>" + firstDate.toString().split(" ")[1] + "-" + firstDate.getFullYear() + "<img/>"+ "</h2>";
        content += "<table class='calendarTable'>";
        content += "<thead >";
        weekDays.map(item=>{
            content += "<th>" + item.fullDay + "</th>";
        });
        content += "</thead>";
        content += "<tbody>";
        let j = 1;
        let displayNum;
        while (j <= lastDate.getDate()) {
            content += "<tr>";
            for (let k = 0; k < 7; k++) {
                displayNum = (j < 10) ? "0" + j : j;
                let dayID = j + "/" + (firstDate.getMonth()+1) + "/" + firstDate.getFullYear();
                let htmlAtts = "'";
                let docNames = doctorNames[dayID];
                if (docNames !== undefined) {
                    htmlAtts += " style='background:#adff2f; cursor: pointer' onclick='openAppsPopup(this.id)'>" + displayNum;
                    if (docNames[0] === "~") {
                        docNames = docNames.split("~");
                        for (let i = 0; i < docNames.length; i++) {
                            if (i >= 4) {
                                htmlAtts += "....";
                                break;
                            }
                            htmlAtts += "<br>" + docNames[i];
                        }
                        // patNames.split("~").forEach(name => colour += "<br>" + name);
                    }else {
                        htmlAtts += "<br>" + docNames;
                    }
                } else {
                    htmlAtts += ">" + displayNum;
                }
                if (j === 1) {
                    if (firstDate.toString().split(" ")[0] === weekDays[k].shortDay) {
                        content += "<td id='" + dayID + htmlAtts + "</td>";
                        j++;
                    }
                    else {
                        content += "<td style='background:#668ab8; cursor: default'></td>";
                    }
                } else if (j > lastDate.getDate()) {
                    content += "<td style='background:#668ab8; cursor: default'></td>";
                } else {
                    content += "<td id='" + dayID + htmlAtts + "</td>";
                    j++;
                }

            }
            content += "</tr>";
        }
        content += "</tbody>";
        content += "</table>";
        content += "</div>";
    }
    return content;

}

function prevMonth() {
    let allMonths = document.getElementsByClassName("calendarDiv");
    document.getElementById("calendarNext").disabled = false;
    allMonths[calendarShow].style.display = "none";
    calendarShow--;
    if (calendarShow >= 0) {
        allMonths[calendarShow].style.display = "block";
        if (calendarShow === 0) {
            document.getElementById("calendarPrev").disabled = true;
        }
    }
}

function  nextMonth() {
    let allMonths = document.getElementsByClassName("calendarDiv");
    document.getElementById("calendarPrev").disabled = false;
    allMonths[calendarShow].style.display = "none";
    calendarShow++;
    if (calendarShow < allMonths.length) {
        allMonths[calendarShow].style.display = "block";
        if (calendarShow === allMonths.length - 1) {
            document.getElementById("calendarNext").disabled = true;
        }
    }
}

function closeAppsPopup(popup) {
    popup.style.display = "none";
}

function popupInit() {
    let popup = document.getElementById("appsPopup");
    let popupClose = document.getElementsByClassName("close")[0];
    popupClose.onclick = function() {
        closeAppsPopup(popup);
    }
    window.onclick = function(event) {
        if (event.target === popup) {
            closeAppsPopup(popup);
        }
    }
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        popupInit();
        getAppointments(user.uid);
    } else {
        ShowLogin(); //Nthabi changed it from redirect to index.html to a popup that will help us log in the user from that page
        document.getElementById("loader").style.display = "none";
    }
});

//for the login at any page down below

function ShowLogin(){
    document.getElementById("log").style.display="block";
}
function Spinner(){
    document.getElementById("loader").style.display = "block";
}

function isNotNull(email,pass){

    let validEmail = true;
    let validPass = true;
    if(email === " "){
        validEmail = false;
    }
    if(pass === " "){
        validPass = false;
    }
    else{
        return true
    }
    return validEmail && validPass;
}

function login(){

    let Email = document.getElementById("email").value; // get email
    let Password = document.getElementById("password").value; // get password

    if(isNotNull(Email,Password)){
        firebase.auth().signInWithEmailAndPassword(Email, Password)
            .then((userCredential) => {
                // Signed in
                let user = userCredential.user;
                LoginUserAs(user.uid);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                window.alert("Unable to login"); //popup on the browser at the top
            });
    }
    else{
        window.alert("Incorrect Login Details");
    }
}

const LoginUserAs = (uid) => {
    let database = firebase.database();
    let ref = database.ref().child('Patients');

    ref.orderByKey().equalTo(uid).once("value", snapshot => {
        if (snapshot.exists()) {
            window.location.reload();
        } else {
            location.href = '../../Patient/home.html'; //get out of script (first two dots) then out of Doctor
        }
    });
}

