const {CheckIfPasswordsMatch, ValidateEmail , ValidateDetails,CheckDoctorInfoNotNull,CheckPatientInfoNotNull} = require('../register')

test("Testing whether the Passwords Match :  ", () => {
    expect(CheckIfPasswordsMatch("KingCobra","KingCobra")).toBe(true);
});

test("Testing whether the Passwords don't Match :  ", () => {
    expect(CheckIfPasswordsMatch("KingCobras","KingCobra")).toBe(false);
});

test("Testing whether the email is correctly formatted", () => {
    expect(ValidateEmail("james@gmail.com")).toBe(true);
});

test("Testing whether the email is badly formatted", () => {
    expect(ValidateEmail("james/@/gmail.com")).toBe(false);
});

test("Testing whether the value is valid", () =>{
    expect(ValidateDetails("Some_String")).toBe(false);
})

test("Testing whether the value is invalid", () =>{
    expect(ValidateDetails(null)).toBe(true);
})

test("Test whether the inputted doctor details  is valid", () =>{
    // Creating the DOM elements

    document.body.innerHTML = "<p id = 'pt_email'></p>" +
        "<div id = 'pt_password'>/div>" + "<p id='pt_confirmPassword'></p>" +
        "<p id = 'pt_age'></p>" + "<p id = 'pt_gender'></p>" + "<p id='pt_name'></p>" +
        "<p id = 'pt_surname'></p>" + "<p id = 'pt_curr_med'></p>" + "<p id='pt_disease_historu'></p>";

        document.getElementById('pt_email').innerText = "mike@gmail.com";
        document.getElementById("pt_password").innerText = "Andrew";
        document.getElementById("pt_confirmPassword").innerText = "Andrew";
        document.getElementById("pt_age").innerText = "55";
        document.getElementById("pt_gender").innerText = "Male";
        document.getElementById("pt_name").innerText = " Mike ";
        document.getElementById("pt_surname").innerText = " Tyson ";
        document.getElementById("pt_curr_med").innerText = " Panado ";
        document.getElementById("pt_disease_historu").innerText = " None";

    expect(CheckPatientInfoNotNull()).toBe(true);

    /*
     let userEmail = document.getElementById("pt_email");
    let userPass = document.getElementById("pt_password");
    let userConfirmPass = document.getElementById("pt_confirmPassword");
    let userAge = document.getElementById("pt_age");
    let userGender = document.getElementById("pt_gender");
    let userName = document.getElementById("pt_name");
    let userSurname = document.getElementById("pt_surname");
    let userMedicationHistory = document.getElementById("pt_curr_med");
    let userDiseaseHistory = document.getElementById("pt_disease_historu");

     */
})