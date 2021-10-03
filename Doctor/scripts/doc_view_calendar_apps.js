
let patientNames = {};
let appointments = [];
let times = ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
let weekDays = [{shortDay:"Mon", fullDay:"Monday"}, {shortDay:"Tue", fullDay:"Tuesday"},
    {shortDay:"Wed", fullDay:"Wednesday"}, {shortDay:"Thu", fullDay:"Thursday"}, {shortDay:"Fri", fullDay:"Friday"},
    {shortDay:"Sat", fullDay:"Saturday"}, {shortDay:"Sun", fullDay:"Sunday"}];

function getAppointments(docID) {
    let database = firebase.database();
    let ref = database.ref().child("Appointments");
    ref.orderByKey().once("value",snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(function (childSnapshot) {
                let app = childSnapshot.val();
                if (app.doctorUid === docID) {
                    appointments.push(app);
                    let patNames = patientNames[app.date_for_appointment];
                    if (patNames === undefined) {
                        patientNames[app.date_for_appointment] = app.patient_Name;
                    } else {
                        let multAppOp = (patNames[0] === '~')  ? "" : "~";
                        patientNames[app.date_for_appointment] = multAppOp + patNames + "~" + app.patient_Name;
                    }
                }
            });
        }
        console.log(patientNames);
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

// const getDoctorList = (docID) => {
//     let database = firebase.database();
//     let ref = database.ref().child('DocSetADT');
//     ref.orderByKey().once("value",snapshot => {
//         if (snapshot.exists()) {
//             snapshot.forEach(function (childSnapshot) {
//                 let app = childSnapshot.val();
//                 // let docUid = app.doctorUid;
//                 let docUid = app.doctorUID;
//                 if (docUid === docID) {
//                     // let doc_id = childSnapshot.key;
//
//                     // let docName = app.doctorName;
//                     // let DocSurname = app.doctorSurname;
//                     // let docSpec = app. doctorSpecialization;
//                     // let docAD = app.doctorAvailableDay;
//                     // let docSDate = app.doctorStartDate;
//                     // let docEDate = app.doctorEndDate;
//                     // let docStartTime = app.doctorAvailableStartTime;
//                     // let docEndTime = app.doctorAvailableEndTime;
//                     // let docApptInterval = app.doctorAppointmentInterval;
//                     // let Allouputs =docUid +"," + docName +","+ DocSurname +","+ docSpec +","+ docAD +","+ docSDate +"," + docEDate +"," + docStartTime+"," + docEndTime+"," + docApptInterval;
//
//                     eventsDict[app.date] = app.slots;
//
//                     // events.push({docUid,docName,DocSurname,docSpec,docAD,docSDate,docEDate,docStartTime,docEndTime,docApptInterval}); // opt1
//                     //events2.push(Allouputs); // opt2
//                     // opt1 uses a array with sets within and those sets are comprised of the doctors details
//                     // opt2 uses concatenations of all doctors information
//                 }
//             });
//             console.log(eventsDict);
//
//             //console.log(events2);
//         }
//         let curDate = new Date();
//         let curMonth = curDate.getMonth() + 1;
//         curMonth = (curMonth < 10) ? "0" + curMonth : curMonth;
//         let curYear = curDate.getFullYear();
//         let nextYear = curYear + 1;
//         document.getElementById("calendar").innerHTML = getDatesBetween(curMonth + "/01/" + curYear, curMonth + "/01/" + nextYear);
//
//         // Dylan Added this
//         document.getElementById("loader").style.display = "none";
//     });
//
// }

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
                "<h2>Appointment with " + app.patient_Name + "</h2>" +
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
                let patNames = patientNames[dayID];
                if (patNames !== undefined) {
                    htmlAtts += " onclick='openAppsPopup(this.id)'>" + displayNum;
                    if (patNames[0] === "~") {
                        patNames = patNames.split("~");
                        for (let i = 0; i < patNames.length; i++) {
                            if (i >= 4) {
                                htmlAtts += "....";
                                break;
                            }
                            htmlAtts += "<br>" + patNames[i];
                        }
                        // patNames.split("~").forEach(name => colour += "<br>" + name);
                    }else {
                        htmlAtts += "<br>" + patNames;
                    }
                } else {
                    htmlAtts += "style='cursor: default'>" + displayNum;
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
    let ref = database.ref().child('Doctors');

    ref.orderByKey().equalTo(uid).once("value", snapshot => {
        if (snapshot.exists()) {
            window.location.reload();
        } else {
            location.href = '../../Patient/home.html'; //get out of script (first two dots) then out of Doctor
        }
    });
}

