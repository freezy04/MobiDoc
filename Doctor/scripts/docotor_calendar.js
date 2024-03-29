
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
                        content += "<td style='background:#668ab8; cursor: default'></td>";
                    }
                } else if (j > lastDate.getDate()) {
                    content += "<td style='background:#668ab8; cursor: default'></td>";
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

function setADT(slotNum,date) {


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
                                    doctorUID:user.uid,
                                    slots:time_app,

                                });

                                // let popup = document.getElementById("accept_app_popup");
                                // popup.style.display = "none";
                                window.location.href = "DoctorCalendarUpdate.html";

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
    let ids = slotID.split("#");
    let slotNum = ids[0];
    let date = ids[1];
    console.log(slotNum + ", " + date);
    localStorage.setItem("This_slot",slotNum)

    if(parseInt(localStorage.getItem("This_slot"))===1){
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
    if(parseInt(localStorage.getItem("This_slot"))===2){
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
    if(parseInt(localStorage.getItem("This_slot"))===3){
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
    if(parseInt(localStorage.getItem("This_slot"))===4){
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
    if(parseInt(localStorage.getItem("This_slot"))===5){
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
    if(parseInt(localStorage.getItem("This_slot"))===6){
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
    if(parseInt(localStorage.getItem("This_slot"))===7){
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
    if(parseInt(localStorage.getItem("This_slot"))===8){
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
    if(parseInt(localStorage.getItem("This_slot"))===9){
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
    if(parseInt(localStorage.getItem("This_slot"))===10){
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


    if(parseInt(localStorage.getItem("This_slot"))===11){
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
    if(parseInt(localStorage.getItem("This_slot"))===12){
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
    if(parseInt(localStorage.getItem("This_slot"))===13){
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
    if(parseInt(localStorage.getItem("This_slot"))===14){
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
    if(parseInt(localStorage.getItem("This_slot"))===15){
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
    if(parseInt(localStorage.getItem("This_slot"))===16){
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
    if(parseInt(localStorage.getItem("This_slot"))===17){
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
    if(parseInt(localStorage.getItem("This_slot"))===18){
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
    if(parseInt(localStorage.getItem("This_slot"))===19){
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
    if(parseInt(localStorage.getItem("This_slot"))===20){
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
    if(parseInt(localStorage.getItem("This_slot"))===21){
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
    if(parseInt(localStorage.getItem("This_slot"))===22){
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
    if(parseInt(localStorage.getItem("This_slot"))===23){
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
    if(parseInt(localStorage.getItem("This_slot"))===24){
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
    if(parseInt(localStorage.getItem("This_slot"))===25){
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
    if(parseInt(localStorage.getItem("This_slot"))===26){
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
    if(parseInt(localStorage.getItem("This_slot"))===27){
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
    if(parseInt(localStorage.getItem("This_slot"))===28){
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




    //todo: firebase update - Naledi + Neo
//setADT(slotNum,date);

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
        // userUID = user.uid;
        getDoctorList(user.uid);
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

