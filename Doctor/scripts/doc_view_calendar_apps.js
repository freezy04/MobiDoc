
let patientNames = {};
let appointments = [];
let appointmentsKeys = [];
let eventsDict = {};

let times = ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
let weekDays = [{shortDay:"Mon", fullDay:"Monday"}, {shortDay:"Tue", fullDay:"Tuesday"},
    {shortDay:"Wed", fullDay:"Wednesday"}, {shortDay:"Thu", fullDay:"Thursday"}, {shortDay:"Fri", fullDay:"Friday"},
    {shortDay:"Sat", fullDay:"Saturday"}, {shortDay:"Sun", fullDay:"Sunday"}];

const getDoctorList = (docID) => {
    let database = firebase.database();
    let ref = database.ref().child('DocSetADT');
    ref.orderByKey().once("value",snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(function (childSnapshot) {
                let app = childSnapshot.val();
                // let docUid = app.doctorUid;
                let docUid = app.doctorUID;
                if (docUid === docID) {
                    eventsDict[app.date] = app.slots;

                }
            });
            console.log(eventsDict);
        }
    });

}

function getAppointments(docID) {
    let database = firebase.database();
    let ref = database.ref().child("Appointments");
    ref.orderByKey().once("value",snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(function (childSnapshot) {
                let app = childSnapshot.val();
                let id_app = childSnapshot.key;
                if (app.doctorUid === docID) {
                    appointments.push(app);
                    appointmentsKeys.push(id_app);
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

function validateCDetails(notes, cost) {
    //let error = document.getElementById("error");
    if (notes === "") {
        error.style.display = "block";
        error.innerHTML = "Notes cannot be empty";
        return false;
    } else if (cost === "") {
        error.style.display = "block";
        error.innerHTML = "Cost cannot be empty";
        return false;
    }
    error.style.display = "none";
    return true;
}

function updateCAppointment(appID,notes, cost) {
    let database = firebase.database();
    let ref = database.ref().child('Appointments');
    ref.child(appID).update({"notes":notes});
    ref.child(appID).update({"appointment_Cost":cost});
    ref.child(appID).update({"status":"completed"});

    let popup = document.getElementById("complete_app_popup");
    popup.style.display = "none";
}

function updateAppointment(appID, rejection_reason) {
    let database = firebase.database();
    const d = new Date();
    let ref = database.ref().child('Appointments');
    ref.child(appID).update({"cancellation_done_by":"Doctor"});
    ref.child(appID).update({"cancellation_date":d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()});
    ref.child(appID).update({"cancellation_reason":rejection_reason});
    ref.child(appID).update({"status":"canceled"});


    let popup = document.getElementById("reject_app_popup");
    popup.style.display = "none";

}

function rejectAppointment(appID) {
    let rejection_reason = document.getElementById("app_rejection_reason").value;
    console.log(appID);

    if (validateDetails(rejection_reason)) {
        updateAppointment(appID, rejection_reason);
    }

}

function completeAppointment(appID) {
    let notes = document.getElementById("app_notes").value;
    let cost = document.getElementById("app_cost").value;

    if (validateCDetails(notes, cost)) {
        updateCAppointment(appID,notes, cost);
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

function openCompleteAppPopup(appID) {
    let popup = document.getElementById("complete_app_popup");
    let close = document.getElementsByClassName("popup-close_")[0];

    let button = document.getElementById("complete_app_btn");
    button.addEventListener('click', function() {
        completeAppointment(appID);
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

function openAppsPopup(dayID) {
    document.getElementById("appsPopup").style.display = "block";
    document.getElementById("appsPopupHeader").innerText = dayID;

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
                    label = "<span class='upcoming'>" + app.status + "</span>";
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
                        "<p class='appCard'>" +
                        "<br/>"+
                        "<button class='appCard' id='" + keys + "' onClick='openRejectAppPopup(this.id)'> Cancel </button>" +
                        //insert popup here to make it more dynamic (next sprint)
                        "</p>" +
                        "<p>" +
                        "<br/>"+
                        "<button class='appCard' id='" + keys + "' onClick='openCompleteAppPopup(this.id)'> Complete </button>" +
                        //insert popup here to make it more dynamic (next sprint)
                        "</p>" +


                        "</table>"
                        +"</div>"
                        +"<br/>";
                    break;
                case "missed":
                    label = "<span class='missed' >" + app.status + "</span>";
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
                    break;
                case "canceled":
                    label = "<span class='canceled' >" + app.status + "</span>";
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
                    break;
                case "completed":
                    label = "<span class='completed' >" + app.status + "</span>";
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
                    break;
            }
            // content +=
            //     "<div class = 'card'>" +
            //     label +
            //     "<h2>Appointment with " + app.patient_Name + "</h2>" +
            //     "<p id='app_id' style='display:none;'>" + app.id + "</p>" +
            //     "<p>" + app.date_for_appointment + " - " + app.time_for_appointment + "</p>" +
            //     "<table class='appCard'>" +
            //     "<tr class='appCard'>" +
            //     "<th class='appCard'>Reason for appointment: </th>" +
            //     "<td class='appCard'>" + app.reason_for_appointment + "</td>" +
            //     "</tr>" +
            //
            //     "</table>"
            //     +"</div>"
            //     +"<br/>";
        }
    }

    document.getElementById("dayAppCards").innerHTML = content;
    // let button = document.getElementById("confirm__app_btn");
    // button.addEventListener('click', function() {
    //     //rejectAppointment(appID);
    //     // #TODO Create Cancel appointment function
    //     openAppsPopup_(dayID)
    //
    //
    // })

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
            switch(app.status){
                case "upcoming":
                    label = "<span class='upcoming'>" + app.status + "</span>";
                    content +=
                        "<div class = 'card'>" +
                        label +
                        "<h2>Appointment with " + app.patient_Name + "</h2>" +
                        "<p id='app_id' style='display:none;'>" + app.id + "</p>" +
                        "<p>" + app.date_for_appointment + " - " + app.time_for_appointment + "</p>" +
                        "<table class='appCard_'>" +
                        "<tr class='appCard_'>" +
                        "<th class='appCard_'>Reason for appointment: </th>" +
                        "<td class='appCard_'>" + app.reason_for_appointment + "</td>" +
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


    // const getAppointmentDetails = (uid) => {
    //     let database = firebase.database();
    //     let ref = database.ref().child('Appointments');
    //     ref.orderByKey().once("value",snapshot => {
    //         if (snapshot.exists()) {
    //             snapshot.forEach(function (childSnapshot) {
    //                 let id_app = childSnapshot.key;
    //                 let app = childSnapshot.val();
    //
    //                 if (uid === app.doctorUid && app.status === "upcoming") {
    //                     //console.log(id_app);
    //
    //                     let label = "<span class='upcoming'>" + app.status + "</span>"; // only displays the pending appointments
    //
    //                     content +=
    //                         "<div class = 'card'>" +
    //                         label +
    //                         "<h2>Appointment with " + app.patient_Name + "</h2>" +
    //                         "<p id='app_id' style='display:none;'>" + app.id + "</p>" +
    //                         "<p>" + app.date_for_appointment + " - " + app.time_for_appointment + "</p>" +
    //                         "<table>" +
    //                         "<tr>" +
    //                         "<th>Reason for appointment: </th>" +
    //                         "<td>" + app.reason_for_appointment + "</td>" +
    //                         "</br>"+
    //                         "<button class='r' id='" + id_app + "' onClick='openRejectAppPopup(this.id)'> Cancel </button>" +
    //                         //insert popup here to make it more dynamic (next sprint)
    //                         "</tr>" +
    //                         "</table>"
    //                         +"</div>"
    //                         +"<br/>"
    //                     ;
    //                 }
    //             });
    //         }
    //     });
    // }

    document.getElementById("dayAppCards_").innerHTML = content;


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
                    htmlAtts += " style='background:#adff2f' onclick='openAppsPopup(this.id)'>" + displayNum;
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
                        content += "<td id='" + dayID + htmlAtts;
                        j++;
                    }
                    else {
                        content += "<td style='background:#668ab8; cursor: default'>";
                    }
                } else if (j > lastDate.getDate()) {
                    content += "<td style='background:#668ab8; cursor: default'>";
                } else {
                    content += "<td id='" + dayID + htmlAtts;
                    j++;
                }

                content += "<button id='" + dayID + "' class='updateSlotBtn' onclick='openDayPopup(this.id, event)'>Update slots</button> </td>"

            }
            content += "</tr>";
        }
        content += "</tbody>";
        content += "</table>";
        content += "</div>";
    }
    return content;
}

function setADT(slotNum,date) {
    let condition


    let database = firebase.database();
    firebase.auth().onAuthStateChanged(function (user) {
            if (user !=null) {
                let ref = database.ref().child('Doctors');
                ref.orderByKey().once("value",snapshot => {
                    if (snapshot.exists()) {
                        snapshot.forEach(function (childSnapshot) {
                            let u = childSnapshot.val();
                            let usersName = u.first_name;
                            if(user.uid === u.uid){
                                let refDoc = database.ref().child('DocSetADT');

                                refDoc.orderByKey().once("value",snapshot => {
                                    if (snapshot.exists()) {
                                        snapshot.forEach(function (childSnapshot) {
                                            let Doc_id = childSnapshot.key;
                                            localStorage.setItem("OUR_DID",Doc_id)
                                            let DocApp = childSnapshot.val();
                                            let sre
                                            localStorage.setItem("OUR_D_DATE",DocApp.date)

                                            if (user.uid === DocApp.doctorUID && (DocApp.date  ===   localStorage.getItem("OUR_DOC_DATE") )) {
                                                // console.log(DocApp.doctorUID)
                                                localStorage.setItem("OUR_DOCT_SLOT",DocApp.slots)
                                                let str =  localStorage.getItem("OUR_DOCT_SLOT")
                                                let sl = localStorage.getItem("OUR_DOC_SLOT")
                                                if(parseInt(sl)===1){
                                                    if (parseInt(str[0])===0){
                                                        sre = str.replaceDAt(0, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }

                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===2){

                                                    if (parseInt(str[1])===0){
                                                        sre = str.replaceDAt(1, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }

                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===3){

                                                    if (parseInt(str[2])===0){
                                                        sre = str.replaceDAt(2, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }

                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===4){
                                                    if (parseInt(str[3])===0){
                                                        sre = str.replaceDAt(3, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===5){
                                                    if (parseInt(str[4])===0){
                                                        sre = str.replaceDAt(4, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===6){
                                                    if (parseInt(str[5])===0){
                                                        sre = str.replaceDAt(5, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===7){
                                                    if (parseInt(str[6])===0){
                                                        sre = str.replaceDAt(6, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===8){
                                                    if (parseInt(str[7])===0){
                                                        sre = str.replaceDAt(7, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===9){
                                                    if (parseInt(str[8])===0){
                                                        sre = str.replaceDAt(8, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===10){
                                                    if (parseInt(str[9])===0){
                                                        sre = str.replaceDAt(9, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(sl)===11){
                                                    if (parseInt(str[10])===0){
                                                        sre = str.replaceDAt(10, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }

                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===12){

                                                    if (parseInt(str[11])===0){
                                                        sre = str.replaceDAt(11, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }

                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===13){

                                                    if (parseInt(str[12])===0){
                                                        sre = str.replaceDAt(12, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }

                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===14){
                                                    if (parseInt(str[13])===0){
                                                        sre = str.replaceDAt(13, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===15){
                                                    if (parseInt(str[14])===0){
                                                        sre = str.replaceDAt(14, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===16){
                                                    if (parseInt(str[15])===0){
                                                        sre = str.replaceDAt(15, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===17){
                                                    if (parseInt(str[16])===0){
                                                        sre = str.replaceDAt(16, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===18){
                                                    if (parseInt(str[17])===0){
                                                        sre = str.replaceDAt(17, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===19){
                                                    if (parseInt(str[18])===0){
                                                        sre = str.replaceDAt(18, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===20){
                                                    if (parseInt(str[19])===0){
                                                        sre = str.replaceDAt(19, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(sl)===21){
                                                    if (parseInt(str[20])===0){
                                                        sre = str.replaceDAt(20, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }

                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===22){

                                                    if (parseInt(str[21])===0){
                                                        sre = str.replaceDAt(21, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }

                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===23){

                                                    if (parseInt(str[22])===0){
                                                        sre = str.replaceDAt(22, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }

                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===24){
                                                    if (parseInt(str[23])===0){
                                                        sre = str.replaceDAt(23, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===25){
                                                    if (parseInt(str[24])===0){
                                                        sre = str.replaceDAt(24, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===26){
                                                    if (parseInt(str[25])===0){
                                                        sre = str.replaceDAt(25, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===27){
                                                    if (parseInt(str[26])===0){
                                                        sre = str.replaceDAt(26, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }
                                                if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===28){
                                                    if (parseInt(str[27])===0){
                                                        sre = str.replaceDAt(27, "1")
                                                        localStorage.setItem("updatedDStr", sre);
                                                        refDoc.child(localStorage.getItem("OUR_DID")).update({"slots":localStorage.getItem("updatedDStr")});
                                                        console.log(DocApp.slots)
                                                        console.log(localStorage.getItem("updatedDStr"))
                                                        console.log(localStorage.getItem("OUR_DOC_SLOT"))
                                                    }
                                                    else {
                                                        alert("Slot is Taken")
                                                    }
                                                }


                                            }



                                        });


                                    }

                                });
                                // let time_app;
                                // if(parseInt(slotNum)=== 1 ){
                                //     time_app = "1000000000000000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 2){
                                //     time_app = "0100000000000000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 3){
                                //     time_app = "0010000000000000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 4){
                                //     time_app = "0001000000000000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 5){
                                //     time_app = "0000100000000000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 6){
                                //     time_app = "0000010000000000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 7){
                                //     time_app = "0000001000000000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 8){
                                //     time_app = "0000000100000000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 9){
                                //     time_app = "0000000010000000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 10){
                                //     time_app = "0000000001000000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 11 ){
                                //     time_app = "0000000000100000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 12){
                                //     time_app = "0000000000010000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 13){
                                //     time_app = "0000000000001000000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 14){
                                //     time_app = "0000000000000100000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 15){
                                //     time_app = "0000000000000010000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 16){
                                //     time_app = "0000000000000001000000000000"
                                // }
                                // else if(parseInt(slotNum)=== 17){
                                //     time_app = "0000000000000000100000000000"
                                // }
                                // else if(parseInt(slotNum)=== 18){
                                //     time_app = "0000000000000000010000000000"
                                // }
                                // else if(parseInt(slotNum)=== 19){
                                //     time_app = "0000000000000000001000000000"
                                // }
                                // else if(parseInt(slotNum)=== 20){
                                //     time_app = "0000000000000000000100000000"
                                // }
                                // else if(parseInt(slotNum)=== 21 ){
                                //     time_app = "0000000000000000000010000000"
                                // }

                                // else if(parseInt(slotNum)=== 22){
                                //     time_app = "0000000000000000000001000000"
                                // }
                                // else if(parseInt(slotNum)=== 23){
                                //     time_app = "0000000000000000000000100000"
                                // }
                                // else if(parseInt(slotNum)=== 24){
                                //     time_app = "0000000000000000000000010000"
                                // }
                                // else if(parseInt(slotNum)=== 25){
                                //     time_app = "0000000000000000000000001000"
                                // }
                                // else if(parseInt(slotNum)=== 26){
                                //     time_app = "0000000000000000000000000100"
                                // }
                                // else if(parseInt(slotNum)=== 27){
                                //     time_app = "0000000000000000000000000010"
                                // }
                                // else if(parseInt(slotNum)=== 28)
                                // {
                                //     time_app = "0000000000000000000000000001"
                                // }

                                //     database.ref().child('DocSetADT').push({

                                //         date: date,
                                //         doctorUID:user.uid,
                                //         slots:time_app,

                                //     });
                                //window.location.href = "./AppointmentTypes/PendingAppointments.html";

                            }
                        });
                    }
                });
            }

            else {
                window.location.href = "../index.html"; // redirects the user to the log in page
            }
        }
    );

}
function changeSlotAvailability(slotID) {//doctor func
    let slot = document.getElementById(slotID);
    if (window.getComputedStyle(slot).backgroundColor === "rgb(240, 128, 128)") {//use firebase logic instead?
        slot.style.backgroundColor = "greenyellow";
    } else {
        slot.style.backgroundColor = "lightcoral";
    }
    console.log(slotID);
    let ids = slotID.split("#");
    let slotNum = ids[0];
    let date = ids[1];
    console.log(slotNum + ", " + date);
    localStorage.setItem("OUR_DOC_SLOT",slotNum)
    localStorage.setItem("OUR_DOC_DATE",date)

    //todo: firebase update - Naledi + Neo
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===1){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "06:00 - 06:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===2){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "06:30 - 07:00" + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===3){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "07:00 - 07:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===4){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "07:30 - 08:00 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===5){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "08:00 - 08:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===6){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "08:30 - 09:00 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===7){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "09:00 - 09:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===8){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "09:30 - 10:00 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===9){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "10:00 - 10:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===10){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "10:30 - 11:00 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }


    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===11){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "11:00 - 11:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===12){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "11:30 - 12:00" + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===13){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "12:00 - 12:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===14){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "12:30 - 13:00 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===15){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "13:00 - 13:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===16){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "13:30 - 14:00 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===17){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "14:00 - 14:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===18){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "14:30 - 15:00 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===19){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "15:00 - 15:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===20){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "15:30 - 16:00 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===21){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "16:00 - 16:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===22){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "16:30 - 17:00" + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===23){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "17:00 - 17:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===24){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "17:30 - 18:00 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===25){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "18:00 - 18:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===26){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "18:30 - 19:00 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===27){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "19:00 - 19:30 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }
    if(parseInt(localStorage.getItem("OUR_DOC_SLOT"))===28){
        //alert("You just picked 06:00  "+"\n"+"Press ok to book")
        let r = confirm("Click ok to confirm time slot");
        if (r === true) {
            let con = confirm("You are about avail yourself for this time: " + "19:30 - 20:00 " + "\nPress Ok to confirm or Cancel" )
            // alert("You just picked 06:00  "+"\n"+"Press ok to book")
            if(con===true){
                //alert("You just set 06:00 - 06:30  "+"\n"+"Press ok to set more slots available")
                setADT(slotNum,date);
            }
            else {
                alert("You canceled chief!")
            }

        }
        else {
            alert("You pressed Cancel!");
        }
    }

    //setADT(slotNum,date);

}


function openDayPopup(dayID, event) {
    event.stopPropagation();//stops button click activating table entry click

    let slots = eventsDict[dayID];

    document.getElementById("dayPopup").style.display = "block";
    document.getElementById("dayPopupHeader").innerText = dayID;
    let content = "<tbody>";
    for (let i = 0; i < 28; i++) {
        let slotColour = (slots !== undefined && slots.charAt(i) === '1') ? "style='background-color: greenyellow'" : "";
        content += "<tr><td id='" + (i+1) + "#" + dayID + "' onclick='changeSlotAvailability(this.id)'" + slotColour + ">" + times[i] + " - " + times[i+1] + "</td></tr>";
    }
    content += "</tbody>";
    document.getElementById("dayTable").innerHTML = content;
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

function appsPopupInit() {
    let popup = document.getElementById("appsPopup");
    let popupClose = document.getElementById("appsPopupClose");
    popupClose.onclick = function() {
        popup.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    }
}

function appsPopup_Init() {
    let popup = document.getElementById("appsPopup_");
    let popupClose = document.getElementById("appsPopup_Close");
    popupClose.onclick = function() {
        popup.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    }
}

function dayPopupInit() {
    let popup = document.getElementById("dayPopup");
    let popupClose = document.getElementById("dayPopupClose");
    popupClose.onclick = function() {
        popup.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    }
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        appsPopupInit();
        appsPopup_Init();
        dayPopupInit();
        getDoctorList(user.uid);
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

