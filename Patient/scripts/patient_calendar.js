
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


function bookAppointmentPopup(slotID) {//patient func
    let popup = document.getElementById("bookingPopup");
    window.onclick = function(event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    }
    document.getElementById("cancel-btn").onclick = function () {
        popup.style.display = "none";
    }


    document.getElementById("radio1").checked = true;
    let r2 = document.getElementById("radio2");
    let r3 = document.getElementById("radio3");
    let r4 = document.getElementById("radio3");
    r2.disabled = true;
    r3.disabled = true;
    r4.disabled = true;

    let ids = slotID.split("#");

    let slots = eventsDict[ids[1]];
    let slotNum = parseInt(ids[0]);
    console.log(slots);
    if (slots[slotNum] === "1") {
        r2.disabled = false;
        console.log(slots[slotNum]);
        if (slots[slotNum + 1] === "1") {
            console.log(slots[slotNum + 1]);
            r3.disabled = false;
            if (slots[slotNum + 2] === "1") {
                console.log(r4.disabled);
                r4.disabled = false;
                //todo: Gabe - fix 2 hour radio button
            }
        }
    }

    popup.style.display = "block";

    document.getElementById("book-btn").onclick = function() {bookApp(ids[0], ids[1])};
}

function bookApp(slotNum, date) {
    let notes = document.getElementById("notesField").value;
    let halfHour = document.getElementById("radio1").checked;
    let hour = document.getElementById("radio2").checked;
    let hourAndHalf = document.getElementById("radio3").checked;
    let twoHours = document.getElementById("radio3").checked;
    console.log(slotNum + ", " + date + ", " + notes + ", " + halfHour);


    //todo: firebase update - Kgosi + Mpho




    document.getElementById("notesField").value = "";
}

function openDayPopup(dayID) {
    // document.getElementById(dayID).style.backgroundColor = "green";

    let slots = eventsDict[dayID];

    document.getElementById("dayPopup").style.display = "block";
    document.getElementById("dayPopupHeader").innerText = dayID;
    let content = "<tbody>";
    for (let i = 0; i < 28; i++) {
        content += "<tr><td id='" + (i+1) + "#" + dayID + "'";
        if (slots !== undefined && slots.charAt(i) === '1') {
            content += "onclick='bookAppointmentPopup(this.id)' style='background-color: greenyellow; cursor: pointer'";
        }
        content += ">" + times[i] + " - " + times[i+1] + "</td></tr>";
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


function popupInit() {
    let popup = document.getElementById("dayPopup");
    let popupClose = document.getElementsByClassName("close")[0];
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
        popupInit();
        getDoctorList(new URL(window.location.href).searchParams.get("doc"));
    } else {
        window.location.href = "../index.html"; // redirects the user to the log in page
    }
});
