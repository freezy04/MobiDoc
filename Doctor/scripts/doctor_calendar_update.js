
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
                let colour = "rgb(91,156,168)";
                let slots = eventsDict[dayID];
                if (slots !== undefined && slots !== "0000000000000000000000000000") {
                    colour =  (slots.split("1").length - 1 < 4) ? "#ffff00" : "#adff2f";
                }
                if (j === 1) {
                    if (firstDate.toString().split(" ")[0] === weekDays[k].shortDay) {
                        // Dylan is testing this :
                        // content += "<td id='" + dayID + "' onclick='openDayPopup(this.id)' style='background-color: " + colour + "'>" + displayNum + "</td>";
                        content += "<td id='" + dayID + "' onclick='openDayPopup(this.id)' style='background-color: " + colour + "'>" + displayNum + "</td>";
                        j++;
                    }
                    else {
                        content += "<td style='background:#668ab8;'></td>";
                    }
                } else if (j > lastDate.getDate()) {
                    content += "<td style='background:#668ab8;'></td>";
                } else {
                    //Dylan : content += "<td class='t' id='" + dayID + "' onclick='openDayPopup(this.id)' style='background-color: " + colour + "'>" + displayNum + "</td>";
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
String.prototype.replaceDAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
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
    setADT(slotNum,date);

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
        ShowLogin(); //Nthabi changed it from redirect to index.html to a popup that will help us log in the user from that page
    }
});

//for the login at any page down below

function ShowLogin(){
    document.getElementById("pop_up_login").style.display="block";
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
                window.location.reload(); //user stays on same page after logging in
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
            location.href = '.../Patient/home.html';
        }
    });
}

