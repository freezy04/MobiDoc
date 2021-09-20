
// let  events = [];
//let events2 = [];

let eventsDict = {};
let times = ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
let weekDays = [{shortDay:"Mon", fullDay:"Monday"}, {shortDay:"Tue", fullDay:"Tuesday"},
    {shortDay:"Wed", fullDay:"Wednesday"}, {shortDay:"Thu", fullDay:"Thursday"}, {shortDay:"Fri", fullDay:"Friday"},
    {shortDay:"Sat", fullDay:"Saturday"}, {shortDay:"Sun", fullDay:"Sunday"}];
// let userUID;

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
                    // let doc_id = childSnapshot.key;

                    // let docName = app.doctorName;
                    // let DocSurname = app.doctorSurname;
                    // let docSpec = app. doctorSpecialization;
                    // let docAD = app.doctorAvailableDay;
                    // let docSDate = app.doctorStartDate;
                    // let docEDate = app.doctorEndDate;
                    // let docStartTime = app.doctorAvailableStartTime;
                    // let docEndTime = app.doctorAvailableEndTime;
                    // let docApptInterval = app.doctorAppointmentInterval;
                    // let Allouputs =docUid +"," + docName +","+ DocSurname +","+ docSpec +","+ docAD +","+ docSDate +"," + docEDate +"," + docStartTime+"," + docEndTime+"," + docApptInterval;

                    eventsDict[app.date] = app.slots;

                    // events.push({docUid,docName,DocSurname,docSpec,docAD,docSDate,docEDate,docStartTime,docEndTime,docApptInterval}); // opt1
                    //events2.push(Allouputs); // opt2
                    // opt1 uses a array with sets within and those sets are comprised of the doctors details
                    // opt2 uses concatenations of all doctors information
                }
            });
            console.log(eventsDict);

            //console.log(events2);
        }
        //todo: Gabe - display upcoming apps?
        let curDate = new Date();
        let curMonth = curDate.getMonth() + 1;
        curMonth = (curMonth < 10) ? "0" + curMonth : curMonth;
        let curYear = curDate.getFullYear();
        let nextYear = curYear + 1;
        document.getElementById("calendar").innerHTML = getDatesBetween(curMonth + "/01/" + curYear, curMonth + "/01/" + nextYear);
    });

}


let calendarShow = 0;

function settingDate(date, day) {
    date = new Date(date);
    date.setDate(day);
    date.setHours(23);
    return date;
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
        content += "<h2>" + firstDate.toString().split(" ")[1] + "-" + firstDate.getFullYear() + "</h2>";
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
                let colour = "#cd5c5c";
                let slots = eventsDict[dayID];
                if (slots !== undefined && slots !== "0000000000000000000000000000") {
                    colour =  (slots.split("1").length - 1 < 4) ? "#ffff00" : "#adff2f";
                }
                if (j === 1) {
                    if (firstDate.toString().split(" ")[0] === weekDays[k].shortDay) {
                        content += "<td id='" + dayID + "' onclick='openDayPopup(this.id)' style='background-color: " + colour + "'>" + displayNum + "</td>";
                        j++;
                    }
                    else {
                        content += "<td></td>";
                    }
                } else if (j > lastDate.getDate()) {
                    content += "<td></td>";
                } else {
                    content += "<td id='" + dayID + "' onclick='openDayPopup(this.id)' style='background-color: " + colour + "'>" + displayNum + "</td>";
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

function setADT() {
    let slotNum = "11";
    let date = "24/9/2021";
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
                                let time_app;
                                if(parseInt(slotNum)=== 1 ){
                                    time_app = "1000000000000000000000000000"
                                }
                                else if(parseInt(slotNum)=== 2){
                                    time_app = "0100000000000000000000000000"
                                }
                                else if(parseInt(slotNum)=== 3){
                                    time_app = "0010000000000000000000000000"
                                }
                                else if(parseInt(slotNum)=== 4){
                                    time_app = "0001000000000000000000000000"
                                }
                                else if(parseInt(slotNum)=== 5){
                                    time_app = "0000100000000000000000000000"
                                }
                                else if(parseInt(slotNum)=== 6){
                                    time_app = "0000010000000000000000000000"
                                }
                                else if(parseInt(slotNum)=== 7){
                                    time_app = "0000001000000000000000000000"
                                }
                                else if(parseInt(slotNum)=== 8){
                                    time_app = "0000000100000000000000000000"
                                }
                                else if(parseInt(slotNum)=== 9){
                                    time_app = "0000000010000000000000000000"
                                }
                                else if(parseInt(slotNum)=== 10){
                                    time_app = "0000000001000000000000000000"
                                }
                                else if(parseInt(slotNum)=== 11 ){
                                    time_app = "0000000000100000000000000000"
                                }
                                else if(parseInt(slotNum)=== 12){
                                    time_app = "0000000000010000000000000000"
                                }
                                else if(parseInt(slotNum)=== 13){
                                    time_app = "0000000000001000000000000000"
                                }
                                else if(parseInt(slotNum)=== 14){
                                    time_app = "0000000000000100000000000000"
                                }
                                else if(parseInt(slotNum)=== 15){
                                    time_app = "0000000000000010000000000000"
                                }
                                else if(parseInt(slotNum)=== 16){
                                    time_app = "0000000000000001000000000000"
                                }
                                else if(parseInt(slotNum)=== 17){
                                    time_app = "0000000000000000100000000000"
                                }
                                else if(parseInt(slotNum)=== 18){
                                    time_app = "0000000000000000010000000000"
                                }
                                else if(parseInt(slotNum)=== 19){
                                    time_app = "0000000000000000001000000000"
                                }
                                else if(parseInt(slotNum)=== 20){
                                    time_app = "0000000000000000000100000000"
                                }
                                else if(parseInt(slotNum)=== 21 ){
                                    time_app = "0000000000000000000010000000"
                                }

                                else if(parseInt(slotNum)=== 22){
                                    time_app = "0000000000000000000001000000"
                                }
                                else if(parseInt(slotNum)=== 23){
                                    time_app = "0000000000000000000000100000"
                                }
                                else if(parseInt(slotNum)=== 24){
                                    time_app = "0000000000000000000000010000"
                                }
                                else if(parseInt(slotNum)=== 25){
                                    time_app = "0000000000000000000000001000"
                                }
                                else if(parseInt(slotNum)=== 26){
                                    time_app = "0000000000000000000000000100"
                                }
                                else if(parseInt(slotNum)=== 27){
                                    time_app = "0000000000000000000000000010"
                                }
                                else if(parseInt(slotNum)=== 28)
                                {
                                    time_app = "0000000000000000000000000001"
                                }


                                //console.log(time_app)
                                // if(date === "" || time === ""){
                                //     alert("Please pick a time and date");
                                //
                                // }
                                //     // else if(valYear < currDate.getFullYear()){
                                //     //     alert("Please choose the correct year");
                                //     //
                                //     // }
                                //     // else if(valMonth < currDate.getMonth()){
                                //     //     alert("Please choose the correct month. You can't book for earlier months");
                                //     //
                                //     // }
                                //     // else if(valDay < currDate.getDate()){
                                //     //     alert("You can only book from today onwards");
                                //     //
                                //     // }
                                //     // else if((valHours < currDate.getHours()) || (valMinutes < currDate.getMinutes())){
                                //     //     alert("It's too late to book at this time. Please book an appropriate time");
                                //     //
                                // // }
                                // else {
                                //
                                database.ref().child('DocSetADT').push({

                                    date: date,
                                    docUID:user.uid,
                                    slots:time_app,

                                });

                                // let popup = document.getElementById("accept_app_popup");
                                // popup.style.display = "none";
                                window.location.href = "./AppointmentTypes/PendingAppointments.html";

                                // edited this to none then the popup disappears off screen after clicking accept button

                                // }

                                ;
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
    //todo: firebase update - Naledi + Neo
setADT();

}


function openDayPopup(dayID) {
    // document.getElementById(dayID).style.backgroundColor = "green";

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

function closeDayPopup(popup) {
    //todo: Gabe - update day colours if slots changed?
    popup.style.display = "none";
}

function popupInit() {
    let popup = document.getElementById("dayPopup");
    let popupClose = document.getElementsByClassName("close")[0];
    popupClose.onclick = function() {
        closeDayPopup(popup);
    }
    window.onclick = function(event) {
        if (event.target === popup) {
            closeDayPopup(popup);
        }
    }
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        popupInit();
        // userUID = user.uid;
        getDoctorList(user.uid);
    } else {
        window.location.href = "../index.html"; // redirects the user to the log in page
    }
});