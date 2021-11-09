const Doc = require('../Doctor/scripts/profile')

test("Update Menu where the menu is responsive", () => {
    // setting up the DOM elements
    document.body.innerHTML = "<div id='responsive-menu'></div>" +
        "<div id='menu'></div>"
    document.getElementById('responsive-menu').checked = true;
    Doc.updatemenu();
    expect(document.getElementById('menu').style.borderBottomRightRadius).toBe("0");

});

test("Update Menu where the menu is unresponsive", () => {
    // setting up the DOM elements
    document.body.innerHTML = "<div id='responsive-menu'></div>" +
        "<div id='menu'></div>"
    document.getElementById('responsive-menu').checked = false;
    Doc.updatemenu();
    expect(document.getElementById('menu').style.borderRadius).toBe("0px");

});

test("Testing whether the value is valid", () =>{
    expect(Doc.ValidateDetails("Some_String")).toBe(true);
})

test("Testing whether the value is invalid", () =>{
    expect(Doc.ValidateDetails(null)).toBe(false);
})

test("Testing the ChangeView Function", () => {
    document.body.innerHTML = "<div id='profile'></div>" +
        "<div id='edit_profile'></div>"
    Doc.ChangeView();
    let style = document.getElementById('edit_profile').style.display;
    let style2 = document.getElementById('profile').style.display;
    expect(style).toBe("flex");
    expect(style2).toBe("none");
})

test("Testing the ReturnToProfile Function", () => {
    document.body.innerHTML = "<div id='profile'></div>" +
        "<div id='edit_profile'></div>"
    Doc.ReturnToProfile();
    let style = document.getElementById('edit_profile').style.display;
    let style2 = document.getElementById('profile').style.display;
    expect(style).toBe("none");
    expect(style2).toBe("flex");
})

test("Testing the SetDataFromFirebase", () => {
    document.body.innerHTML = "<p id='email'></p>" + "<p id='Name'></p>"
        + "<p id='experience'></p>" + "<p id='qualification'></p>" +
        "<p id='specialization'></p>"
    Data = {first_name:"Mike",last_name:"James",specialization: "dentist",experience: "15",email:"mj@gmail.com"}
    let bool = Doc.SetDataFromFirebase(Data);
    expect(bool).toBeTruthy();
})