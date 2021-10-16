const mailField = document.getElementById('mail');
const labels = document.getElementsByTagName('label');
const resetPassword = document.getElementById('resetPassword');


const auth = firebase.auth();

//auth.languageCode = 'DE_de';

auth.useDeviceLanguage();

const resetPasswordFunction = () => {
    const email = mailField.value;

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert('Password Reset Email Sent Successfully!');
            location.href = "index.html";
        })
        .catch(error => {
            console.error(error);
            alert("Incorrect email/User not found");
        })
}


resetPassword.addEventListener('click', resetPasswordFunction);

//Animations
mailField.addEventListener('focus', () => {
    labels.item(0).className = "focused-field";
});

mailField.addEventListener('blur', () => {
    if(!mailField.value)
        labels.item(0).className = "unfocused-field";
});