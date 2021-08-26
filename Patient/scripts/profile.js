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

module.exports = {ReturnToProfile,ChangeView,ValidateDetails,updatemenu}