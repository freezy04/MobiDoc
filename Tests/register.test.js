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
    expect(ValidateEmail("james@/@/@gmail.com")).toBe(false);
});

test("Testing whether the value is valid", () =>{
    expect(ValidateDetails("Some_String")).toBe(false);
})

test("Testing whether the value is invalid", () =>{
    expect(ValidateDetails(null)).toBe(true);
})

// test("Test whether the inputted patient details  is valid", () =>{
//     // Creating the DOM elements
//
//     document.body.innerHTML = "<p id='error_text'></p>" + "<p id = 'pt_email'></p>" +
//         "<div id = 'pt_password'>/div>" + "<p id='pt_confirmPassword'></p>" +
//         "<p id = 'pt_age'></p>" + "<p id = 'pt_gender'></p>" + "<p id='pt_name'></p>" +
//         "<p id = 'pt_surname'></p>" + "<p id = 'pt_curr_med'></p>" + "<p id='pt_disease_historu'></p>";
//
//         document.getElementById('pt_email').value = "mike@gmail.com";
//         document.getElementById("pt_password").innerText = "Andrew";
//         document.getElementById("pt_confirmPassword").innerText = "Andrew";
//         document.getElementById("pt_age").innerText = "55";
//         document.getElementById("pt_gender").innerText = "Male";
//         document.getElementById("pt_name").innerText = " Mike ";
//         document.getElementById("pt_surname").innerText = " Tyson ";
//         document.getElementById("pt_curr_med").innerText = " Panado ";
//         document.getElementById("pt_disease_historu").innerText = " None";
//
//     expect(CheckPatientInfoNotNull()).toBe(true);
// })

test("Test whether the inputted patient details  is invalid", () =>{
    // Creating the DOM elements

    document.body.innerHTML = "<p id='doc_error_text'></p>" + "<p id = 'pt_email'></p>" +
        "<div id = 'pt_password'></div>" + "<p id='pt_confirmPassword'></p>" +
        "<p id = 'pt_age'></p>" + "<p id = 'pt_gender'></p>" + "<p id='pt_name'></p>" +
        "<p id = 'pt_surname'></p>" + "<p id = 'pt_curr_med'></p>" + "<p id='pt_disease_historu'></p>";

    document.getElementById('pt_email').value = "";
    document.getElementById("pt_password").value = "";
    document.getElementById("pt_confirmPassword").value = "";
    document.getElementById("pt_age").value = "";
    document.getElementById("pt_gender").value = "";
    document.getElementById("pt_name").value = "";
    document.getElementById("pt_surname").value = "";
    document.getElementById("pt_curr_med").value = "";
    document.getElementById("pt_disease_historu").value = "";

    expect(CheckPatientInfoNotNull()).toBe(false);
})

test("Test whether the inputted doctor details  is invalid", () =>{
    // Creating the DOM elements

    document.body.innerHTML = "<p id='error'></p>" + "<p id = 'doc_email'></p>" +
        "<div id = 'doc_password'></div>" + "<p id='doc_confirmPassword'></p>" +
        "<p id = 'doc_specialization'></p>" + "<p id = 'doc_qualifications'></p>" + "<p id='doc_name'></p>" + "<p id = 'doc_surname'></p>" + "<p id = 'doc_experience'></p>";

    document.getElementById('doc_email').value = "";
    document.getElementById("doc_password").value = "";
    document.getElementById("doc_confirmPassword").value = null;
    document.getElementById("doc_specialization").value = null;
    document.getElementById("doc_qualifications").value = null;
    document.getElementById("doc_name").value = null;
    document.getElementById("doc_surname").value = null;
    document.getElementById("doc_experience").value = null;

    expect(CheckDoctorInfoNotNull()).toBe(false);
})

// test("Test whether the inputted doctor details  is valid", () =>{
//     // Creating the DOM elements
//     document.body.innerHTML = "<p id='error'></p>" + "<p id = 'doc_email'></p>" +"<p id = 'doc_password'></p>" + "<p id='doc_confirmPassword'></p>" + "<p id = 'doc_specialization'></p>" +
//         "<p id = 'doc_qualifications'></p>" + "<p id='doc_name'></p>" + "<p id = 'doc_surname'></p>" + "<p id = 'doc_experience'></p>";
//
//     let str = "jamesll@/gmail/.com";
//     document.getElementById("doc_email").innerText = str;
//     let k = document.getElementById("doc_email").innerText;
//     document.getElementById("doc_password").innerText = "Jest";
//     document.getElementById("doc_confirmPassword").innerText = "Jest";
//     document.getElementById("doc_specialization").innerText = "Dentist";
//     document.getElementById("doc_qualifications").innerText = "Health";
//     document.getElementById("doc_name").innerText = "James";
//     document.getElementById("doc_surname").innerText = "Mike";
//     document.getElementById("doc_experience").innerText = "5";
//
//     expect(CheckDoctorInfoNotNull()).toBe(true);
// })


