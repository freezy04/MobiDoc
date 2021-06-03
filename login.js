const auth = firebase.auth();
const password = document.getElementById("pass");
const show_pass = document.getElementById("show_pass");

function toggle_pass_show(){

    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    show_pass.classList.toggle('fa-eye-slash');

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
$("#login_user").click(function () {
    login();
});

function login(){

    let Email = document.getElementById("email").value;
    let Password = document.getElementById("pass").value;
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
                    let p_error = document.getElementById("error");
                    p_error.style.display = "block";
                    p_error.innerHTML = errorMessage;
                });
    }
    else{
        window.alert("Incorrect Login Details");

    }

}

const LoginUserAs = (uid) => {
    let database = firebase.database();
    let ref = database.ref().child('Doctors');

    ref.orderByKey().equalTo(uid).once("value",snapshot => {
        if (snapshot.exists()){
                location.href = 'Doctor/home.html';
        }
        else{
            location.href = 'Patient/home.html';
        }
    });


}