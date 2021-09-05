let pt_email , pt_pass , pt_confirmPass , pt_age , pt_name , pt_surname , pt_gender , pt_dsHistory,pt_medCurrent,pt_allergies;

// This function tests whether the passwords match
function CheckIfPasswordsMatch(userPass,userConfirmPass){
    return userPass === userConfirmPass;
}

const ValidateDetails = (Details) =>{
    return Details === null || Details === "";
}


function ValidateEmail(Email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email);
}


// This functions tests whether the passwords match and provide feedback to the user



let DocErrorMessage = "";
function CheckDoctorInfoNotNull(){

    let isValid = true;
    let docEmail = document.getElementById("doc_email").value;
    let docPass = document.getElementById("doc_password").value;
    let docConfirmPass = document.getElementById("doc_confirmPassword").value;
    let docName = document.getElementById("doc_name").value;
    let docSurname = document.getElementById("doc_surname").value;
    let docSpecialization = document.getElementById("doc_specialization").value;
    let docExperience = document.getElementById("doc_experience").value;
    let docQualifications = document.getElementById("doc_qualifications").value

    if(!ValidateEmail(docEmail)){
        DocErrorMessage += "The email is invalid";
        isValid = false;

    }
    if(ValidateDetails(docName)){
        DocErrorMessage += "\n" + "The Name is invalid";
        isValid = false;

    }
    if(ValidateDetails(docSurname)){
        DocErrorMessage += "\n" + "The Surname is invalid";
        isValid = false;

    }
    if(ValidateDetails(docPass)){
        DocErrorMessage += "\n" + "The Password is invalid";
        isValid = false;
    }

    if(ValidateDetails(docConfirmPass)){
        DocErrorMessage += "\n" + "The Confirm Password is invalid";
        isValid = false;
    }
    if(ValidateDetails(docExperience)){
        DocErrorMessage += "\n" + "The Experience is invalid";
        isValid = false;

    }
    if(ValidateDetails(docQualifications)){
        DocErrorMessage += "\n" + "The Qualification Field is invalid";
        isValid = false;

    }

    return isValid;

}


let Patient_errorMessage="";
function CheckPatientInfoNotNull(){


    let isValid = true;
    let userEmail = document.getElementById("pt_email").value;
    let userPass = document.getElementById("pt_password").value;
    let userConfirmPass = document.getElementById("pt_confirmPassword").value;
    let userAge = document.getElementById("pt_age").value;
    let userGender = document.getElementById("pt_gender").value;
    let userName = document.getElementById("pt_name").value;
    let userSurname = document.getElementById("pt_surname").value;
    let userMedicationHistory = document.getElementById("pt_curr_med").value;
    let userDiseaseHistory = document.getElementById("pt_disease_historu").value;


    if(!ValidateEmail(userEmail)){
        Patient_errorMessage += "The email is invalid";
        isValid = false;

    }

    if(ValidateDetails(userName)){
        Patient_errorMessage += "\n" + "The Name is invalid";
        isValid = false;

    }
    if(ValidateDetails(userSurname)){
        Patient_errorMessage += "\n" + "The Surname is invalid";
        isValid = false;

    }
    if(ValidateDetails(userPass)){
        Patient_errorMessage += "\n" + "The Password is invalid";
        isValid = false;

    }
    if(ValidateDetails(userPass)){
        Patient_errorMessage += "\n" + "The Confirm Password is invalid";
        isValid = false;
    }
    if(ValidateDetails(userAge)){
        Patient_errorMessage += "\n" + "The Age is invalid";
        isValid = false;
    }
    if(ValidateDetails(userGender)){
        Patient_errorMessage += "\n" + "The Gender is invalid";
        isValid = false;
    }
    if(ValidateDetails(userDiseaseHistory)){
        Patient_errorMessage += "\n" + "The Disease History is invalid";
        isValid = false;
    }
    if(ValidateDetails(userMedicationHistory)){
        Patient_errorMessage += "\n" + "The Current Medication is invalid";
        isValid = false;
    }

    return isValid;
}
function register_doctor(){

    let docEmail = document.getElementById("doc_email").value;
    let docPass = document.getElementById("doc_password").value;
    let docConfirmPass = document.getElementById("doc_confirmPassword").value;
    let docName = document.getElementById("doc_name").value;
    let docSurname = document.getElementById("doc_surname").value;
    let docSpecialization = document.getElementById("doc_specialization").value;
    let docExperience = document.getElementById("doc_experience").value;
    let docQualifications = document.getElementById("doc_qualifications").value;

    if(CheckDoctorInfoNotNull() && CheckIfPasswordsMatch(docPass,docConfirmPass)) {

        let database = firebase.database();
        firebase.auth().createUserWithEmailAndPassword(docEmail, docPass)

            .then((userCredential) => {
                // Signed in
                document.getElementById("doc_loader").style.display = "block";
                let user = userCredential.user;
                database.ref().child('Doctors').child(user.uid).set({
                    email: docEmail,
                    experience: docExperience,
                    first_name: docName,
                    last_name: docSurname,
                    qualifications: docQualifications,
                    specialization: docSpecialization,
                    uid: user.uid,
                    user_type: "Doctor"
                });
                console.log("Doctor registered");
                setTimeout(() => {  window.location.href = "index.html"; }, 2000);
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
            });

    }

    else{
        let errorWindow = document.getElementById("doc_error_text");
        errorWindow.style.display = "block";
        errorWindow.innerHTML = DocErrorMessage;
    }
}

// Register Patient Function
function register_patient(){

    let userEmail = document.getElementById("pt_email").value;
    let userPass = document.getElementById("pt_password").value;
    let userConfirmPass = document.getElementById("pt_confirmPassword").value;
    let userAge = document.getElementById("pt_age").value;
    let userGender = document.getElementById("pt_gender").value;
    let userName = document.getElementById("pt_name").value;
    let userSurname = document.getElementById("pt_surname").value;
    let userMedicationHistory = document.getElementById("pt_curr_med").value;
    let userDiseaseHistory = document.getElementById("pt_disease_historu").value;
    let userAllergies = document.getElementById("pt_allergies").value;

    if(CheckPatientInfoNotNull() && CheckIfPasswordsMatch(userPass,userConfirmPass)){
        let database = firebase.database();
        firebase.auth().createUserWithEmailAndPassword(userEmail,userPass)

            .then((userCredential) => {
                // Signed in
                document.getElementById("pt_loader").style.display = "block";
                let user = userCredential.user;
                database.ref().child('Patients').child(user.uid).set({
                    age:userAge,
                    allergies:userAllergies,
                    diseaseHistory:userDiseaseHistory,
                    email:userEmail,
                    first_name:userName,
                    last_name:userSurname,
                    medicationHistory:userMedicationHistory,
                    sex:userGender,
                    uid:user.uid,
                    user_type:"Patient"
                });
                console.log("Patient Registered");
                setTimeout(() => { window.location.href = "index.html"; }, 2000);
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
            });

    }
    else{
        let errorWindow = document.getElementById("error_text");
        errorWindow.style.display = "block";
        errorWindow.innerHTML = Patient_errorMessage;
    }

}

// Setting up the Toggle Passwords :

const doc_togglePassword = document.getElementById('doc_togglePassword');
const doc_password = document.getElementById('doc_password');
const doc_togglePasswordC = document.getElementById('doc_togglePasswordC');
const doc_passwordC = document.getElementById('doc_confirmPassword');
const pt_togglePassword = document.getElementById('pt_togglePassword');
const pt_password = document.getElementById('pt_password');
const pt_togglePasswordC =document.getElementById('pt_togglePasswordC');
const pt_passwordC = document.getElementById('pt_confirmPassword');

module.exports = {ValidateDetails,ValidateEmail,CheckIfPasswordsMatch,CheckDoctorInfoNotNull,CheckPatientInfoNotNull};