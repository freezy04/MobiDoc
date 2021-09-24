function updatemenu() {
    if (document.getElementById('responsive-menu').checked === true) {
        document.getElementById('menu').style.borderBottomRightRadius = '0';
        document.getElementById('menu').style.borderBottomLeftRadius = '0';
    }
    else{
        document.getElementById('menu').style.borderRadius = '0px';
    }
}

const ValidateDetails = (Details) =>{
    return Details === null;
}

function ChangeView(){
    document.getElementById("profile").style.display = "none";
    document.getElementById("edit_profile").style.display = "flex";
}

function ReturnToProfile(){
    document.getElementById("profile").style.display = "flex";
    document.getElementById("edit_profile").style.display = "none";
}

// function SetDataFromFirebase(Patient){
//
//     let email = document.getElementById("email");
//     let name = document.getElementById("Name");
//     let Exp = document.getElementById("experience");
//     let QL = document.getElementById("qualification");
//     let Spec = document.getElementById("specialization");
//
//     name.innerText =  Patient.first_name + " " + Patient.last_name;
//     Spec.innerText = Patient.specialization;
//     Exp.innerText = Patient.experience;
//     QL.innerText = Patient.qualifications;
//     email.innerText =Patient.email;
//
//     return true;
// }
// login any user :

function ShowLogin() {
    document.getElementById("log").style.display = "block";
    document.getElementById("loader").style.display = "none";
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

    let Email = document.getElementById("lemail").value; // get email
    let Password = document.getElementById("password").value; // get password

    if(isNotNull(Email,Password)){
        firebase.auth().signInWithEmailAndPassword(Email, Password)
            .then((userCredential) => { <!--Refreshes the page-->
                // Signed in
                let user = userCredential.user;
                LoginUserAs(user.uid);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                window.alert("Unable to login"); <!--Little popup at the top of your browser -->
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
            location.href = '../Doctor/home.html';
        }
    });
}
//end of login from any page
module.exports = {ReturnToProfile,ChangeView,ValidateDetails,updatemenu}