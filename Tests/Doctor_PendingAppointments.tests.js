const Appoint = require("../Doctor/scripts/PendingAppointments")

test("Update Menu where the menu is responsive", () => {
    // setting up the DOM elements
    document.body.innerHTML = "<div id='responsive-menu'></div>" +
        "<div id='menu'></div>"
    document.getElementById('responsive-menu').checked = true;
    Appoint.updatemenu();
    expect(document.getElementById('menu').style.borderBottomRightRadius).toBe("0");

});

test("Update Menu where the menu is unresponsive", () => {
    // setting up the DOM elements
    document.body.innerHTML = "<div id='responsive-menu'></div>" +
        "<div id='menu'></div>"
    document.getElementById('responsive-menu').checked = false;
    Appoint.updatemenu();
    expect(document.getElementById('menu').style.borderRadius).toBe("0px");

});