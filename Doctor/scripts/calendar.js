
var  events = [];
//var events2 = [];

let times = ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
let weekDays = [{shortDay:"Mon", fullDay:"Monday"}, {shortDay:"Tue", fullDay:"Tuesday"},
    {shortDay:"Wed", fullDay:"Wednesday"}, {shortDay:"Thu", fullDay:"Thursday"}, {shortDay:"Fri", fullDay:"Friday"},
    {shortDay:"Sat", fullDay:"Saturday"}, {shortDay:"Sun", fullDay:"Sunday"}];

const getDoctorList = () => {
    let database = firebase.database();
    let ref = database.ref().child('DocSetADT');
    ref.orderByKey().once("value",snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(function (childSnapshot) {
                let doc_id = childSnapshot.key;
                let app = childSnapshot.val();
                let docUid = app.doctorUid
                let docName = app.doctorName
                let DocSurname = app.doctorSurname
                let docSpec = app. doctorSpecialization
                let docAD = app.doctorAvailableDay
                let docSDate = app.doctorStartDate
                let docEDate = app.doctorEndDate
                let docStartTime = app.doctorAvailableStartTime
                let docEndTime = app.doctorAvailableEndTime
                let docApptInterval = app.doctorAppointmentInterval
                var Allouputs =docUid +"," + docName +","+ DocSurname +","+ docSpec +","+ docAD +","+ docSDate +"," + docEDate +"," + docStartTime+"," + docEndTime+"," + docApptInterval;

                events.push({docUid,docName,DocSurname,docSpec,docAD,docSDate,docEDate,docStartTime,docEndTime,docApptInterval}); // opt1
                //events2.push(Allouputs); // opt2
                // opt1 uses a array with sets within and those sets are comprised of the doctors details
                // opt2 uses concatenations of all doctors information
            });
            console.log(events)
            //console.log(events2)
        }
    });

    //todo: change to take docID as parameter, only return that doc's intervals
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
                if (j === 1) {
                    if (firstDate.toString().split(" ")[0] === weekDays[k].shortDay) {
                        content += "<td id='" + dayID + "' onclick='openDayPopup(this.id)'>" + displayNum + "</td>";
                        j++;
                    }
                    else {
                        content += "<td></td>";
                    }
                } else if (j > lastDate.getDate()) {
                    content += "<td></td>";
                } else {
                    content += "<td id='" + dayID + "' onclick='openDayPopup(this.id)'>" + displayNum + "</td>";
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

//todo: Gabe - function to fill in all availability details from firebase

function changeSlotAvailability(slotID) {//doctory func
    let slot = document.getElementById(slotID)
    if (window.getComputedStyle(slot).backgroundColor === "rgb(240, 128, 128)") {//use firebase logic instead?
        slot.style.backgroundColor = "green";
    } else {
        slot.style.backgroundColor = "lightcoral";
    }
    //todo: firebase update
}

function bookAppointmentPopup(slotID) {//patient func
    //todo: Gabe - func + manage doc vs patient
}

function openDayPopup(dayID) {
    // document.getElementById(dayID).style.backgroundColor = "green";
    popup.style.display = "block";
    document.getElementById("dayPopupHeader").innerText = dayID;
    let content = "<tbody>";
    for (let i = 0; i < 28; i++) {
        content += "<tr><td id='" + (i+1) + dayID + "' onclick='changeSlotAvailability(this.id)'>" + times[i] + " - " + times[i+1] + "</td></tr>";
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

//todo: Gabe - auto manage dates
let content = getDatesBetween("01/01/2021", "01/01/2022");
document.getElementById("calendar").innerHTML = content;
