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

function SetDataFromFirebase(Doctor){

    let email = document.getElementById("email");
    let name = document.getElementById("Name");
    let Exp = document.getElementById("experience");
    let QL = document.getElementById("qualification");
    let Spec = document.getElementById("specialization");

    name.innerText = "Dr " + Doctor.first_name + " " + Doctor.last_name;
    Spec.innerText = Doctor.specialization;
    Exp.innerText = Doctor.experience;
    QL.innerText = Doctor.qualifications;
    email.innerText = Doctor.email;

    return true;
}

module.exports = {SetDataFromFirebase,ReturnToProfile,ChangeView,ValidateDetails,updatemenu}