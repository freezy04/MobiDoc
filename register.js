let pt_email , pt_pass , pt_confirmPass , pt_age , pt_name , pt_surname , pt_gender , pt_dsHistory,pt_medCurrent,pt_allergies;


function PasswordCheck(userPass,userConfirmPass){

    let pass_input = document.getElementById("pt_password");
    let confirmPass_input = document.getElementById("pt_confirmPassword");

    if(userPass !== userConfirmPass){
        pass_input.setCustomValidity("Passwords do not match");
        confirmPass_input.setCustomValidity("Passwords do not match");
        return false;
    }
    else{
        pass_input.setCustomValidity(" ");
        confirmPass_input.setCustomValidity(" ")
        return true;
    }

}

$("#pt_register").click(function () {
    register_patient();
})
$("#doc_register").click(function () {
    register_doctor();
})

let password = document.getElementById("doc_password"), confirm_password = document.getElementById("doc_confirmPassword");
password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

function validatePassword(){
    if(password.value !== confirm_password.value) {
        confirm_password.setCustomValidity("Passwords Don't Match");
        return false;
    } else {
        confirm_password.setCustomValidity('');
        return true;
    }
}


let DocErrorMessage = " ";
function CheckDoctorInfoNotNull(){
    let isValid = true;
    let docEmail = document.getElementById("doc_email");
    let docPass = document.getElementById("doc_password");
    let docConfirmPass = document.getElementById("doc_confirmPassword");
    let docName = document.getElementById("doc_name");
    let docSurname = document.getElementById("doc_surname");
    let docSpecialization = document.getElementById("doc_specialization");
    let docExperience = document.getElementById("doc_experience");
    let docQualifications = document.getElementById("doc_qualifications")

    if(!docEmail.checkValidity()){
        DocErrorMessage += "\n" + "The email is invalid";
        isValid = false;

    }
    if(!docName.checkValidity()){
        DocErrorMessage += "\n" + "The Name is invalid";
        isValid = false;

    }
    if(!docSurname.checkValidity()){
        DocErrorMessage += "\n" + "The Surname is invalid";
        isValid = false;

    }
    if(!docPass.checkValidity()){
        DocErrorMessage += "\n" + "The Password is invalid";
        isValid = false;
    }

    if(!docConfirmPass.checkValidity()){
        DocErrorMessage += "\n" + "The Confirm Password is invalid";
        isValid = false;
    }
    if(!docExperience.checkValidity()){
        DocErrorMessage += "\n" + "The Experience is invalid";
        isValid = false;

    }
    if(!docQualifications.checkValidity()){
        DocErrorMessage += "\n" + "The Qualification Field is invalid";
        isValid = false;

    }
    return isValid;

}


let Patient_errorMessage= " ";
function CheckPatientInfoNotNull(){
    let isValid = true;
    let userEmail = document.getElementById("pt_email");
    let userPass = document.getElementById("pt_password");
    let userConfirmPass = document.getElementById("pt_confirmPassword");
    let userAge = document.getElementById("pt_age");
    let userGender = document.getElementById("pt_gender");
    let userName = document.getElementById("pt_name");
    let userSurname = document.getElementById("pt_surname");
    let userMedicationHistory = document.getElementById("pt_curr_med");
    let userDiseaseHistory = document.getElementById("pt_disease_historu");


    if(!userEmail.checkValidity()){
        Patient_errorMessage += "\n" + "The email is invalid";
        isValid = false;

    }
    if(!userName.checkValidity()){
        Patient_errorMessage += "\n" + "The Name is invalid";
        isValid = false;

    }
    if(!userSurname.checkValidity()){
        Patient_errorMessage += "\n" + "The Surname is invalid";
        isValid = false;

    }
    if(!userPass.checkValidity()){
        Patient_errorMessage += "\n" + "The Password is invalid";
        isValid = false;

    }
    if(!userConfirmPass.checkValidity()){
        Patient_errorMessage += "\n" + "The Confirm Password is invalid";
        isValid = false;
    }
    if(!userAge.checkValidity()){
        Patient_errorMessage += "\n" + "The Age is invalid";
        isValid = false;
    }
    if(!userGender.checkValidity()){
        Patient_errorMessage += "\n" + "The Gender is invalid";
        isValid = false;
    }
    if(!userDiseaseHistory.checkValidity()){
        Patient_errorMessage += "\n" + "The Disease History is invalid";
        isValid = false;
    }
    if(!userMedicationHistory.checkValidity()){
        Patient_errorMessage += "\n" + "The Current Medication is invalid";
        isValid = false;
    }
    return isValid;
}

//Register Doctor Function

function register_doctor(){

    let docEmail = document.getElementById("doc_email").value;
    let docPass = document.getElementById("doc_password").value;
    let docConfirmPass = document.getElementById("doc_confirmPassword").value;
    let docName = document.getElementById("doc_name").value;
    let docSurname = document.getElementById("doc_surname").value;
    let docSpecialization = document.getElementById("doc_specialization").value;
    let docExperience = document.getElementById("doc_experience").value;
    let docQualifications = document.getElementById("doc_qualifications").value;

        if(CheckDoctorInfoNotNull() && validatePassword()) {

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

    if(CheckPatientInfoNotNull() && PasswordCheck(userPass,userConfirmPass)){
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

function toggle_doc_pass(){
    // toggle the type attribute
    const type = doc_password.getAttribute('type') === 'password' ? 'text' : 'password';
    doc_password.setAttribute('type', type);
    // toggle the eye slash icon
    doc_togglePassword.classList.toggle('fa-eye-slash');
}
function toggle_doc_passC(){
    // toggle the type attribute
    const type = doc_passwordC.getAttribute('type') === 'password' ? 'text' : 'password';
    doc_passwordC.setAttribute('type', type);
    // toggle the eye slash icon
    doc_togglePasswordC.classList.toggle('fa-eye-slash');
}
function toggle_pt_pass(){
    // toggle the type attribute
    const type = pt_password.getAttribute('type') === 'password' ? 'text' : 'password';
    pt_password.setAttribute('type', type);
    // toggle the eye slash icon
    pt_togglePassword.classList.toggle('fa-eye-slash');
}

function toggle_pt_passC(){
    // toggle the type attribute
    const type = pt_passwordC.getAttribute('type') === 'password' ? 'text' : 'password';
    pt_passwordC.setAttribute('type', type);
    // toggle the eye slash icon
    pt_togglePasswordC.classList.toggle('fa-eye-slash');
}



