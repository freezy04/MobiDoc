
function convertDate(date){
    let parts_of_date = date.split("/");
    let output = new Date(+parts_of_date[2], parts_of_date[1] - 1, +parts_of_date[0]);
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    return days[output.getDay()];
}

const generateCancelEmailTemplate = (Surname , Date) =>{
    let mail = "<!DOCTYPE html>" +
        "<html lang='en' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'>" +
        "<head>" +
        "<meta http-equiv='content-type' content='text/html; charset=utf-8'>" +
        "<meta name='viewport' content='width=device-width, initial-scale=1.0;'>" +
        "<meta name='format-detection' content='telephone=no'/>" +
        "<style>" +
        "/* Reset styles */ " +
        "body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}" +
        "body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }" +
        "table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }" +
        "img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }" +
        "#outlook a { padding: 0; }" +
        ".ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }" +
        ".ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }\n" +
        "\n" +
        "/* Rounded corners for advanced mail clients only */ " +
        "@media all and (min-width: 560px) {" +
        ".container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px;}" +
        "}" +
        "/* Set color for auto links (addresses, dates, etc.) */ " +
        "a, a:hover {" +
        "color: #127DB3;" +
        "}" +
        ".footer a, .footer a:hover {" +
        "color: #999999;" +
        "}" +
        "</style>\n" +
        "<title>Get this responsive email template</title>\n" +
        "</head>\n" +
        "<body topmargin='0' rightmargin='0' bottommargin='0' leftmargin='0' marginwidth='0' marginheight='0' width='100%' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;\n" +
        "background-color: #F0F0F0;\n" +
        "color: #000000;'" +
        "bgcolor='#f5f5f5;'" +
        "text='#000000'>" +
        "<table width='100%' align='center' border='0' cellpadding='0' cellspacing='0' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;' class='background'><tr><td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;'" +
        "bgcolor='#F0F0F0'>" +
        "<table border='0' cellpadding='0' cellspacing='0' align='center'" +
        "width='602' style='border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;" +
        "max-width: 560px;' class='wrapper'>" +
        "</table>" +
        "<table border='0' cellpadding='0' cellspacing='0' align='center'" +
        "bgcolor='#FFFFFF'" +
        "width='602' style='border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;" +
        "max-width: 560px;' class='container'>" +
        "<tr>" +
        "<td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; " +
        "padding: 20px 0;' class='hero'><img border='0'" +
        "src='https://img.freepik.com/free-vector/office-illustration_73749-393.jpg'" +
        "alt='Please enable images to view this content' title='cancelled appointments'" +
        "width='602' style='" +
        "width: 100%;" +
        "max-width: 602px;" +
        "height: 10%;" +
        "color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;'/></td>" +
        "</tr>" +
        "<tr>" +
        "<td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 20px; font-weight: bold; line-height: 130%;" +
        "color: #000000;" +
        "font-family: sans-serif;' class='header'>" +
        "Appointment Cancellation" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;" +
        "padding-top: 15px;" +
        "color: #000000;" +
        "alignment: left;" +
        "font-family: sans-serif;' class='paragraph'>" +
        "<p>Dear Mr/Ms " + Surname +  "</p>" +
        "<p style='padding-top: 5%' >We trust this email finds you well.</p>\n" +
        "<p style='padding-top: 3%;padding-bottom: 2%'>Please note that the appointment on <u><b> " + convertDate(Date) + "," + Date + " </b></u> has been cancelled.</p>" +
        "<p> If this was a mistake , please rectify it on the <a href = 'https://mobidoc-6a3ac.firebaseapp.com/'> website </a> .</p>" +
        "<p>Wishing you good health.</p>\n" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;\n" +
        "padding-top: 25px;' class='line'><hr\n" +
        "color='#E0E0E0' align='center' width='100%' size='1' noshade style='margin: 0; padding: 0;' />\n" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;\n" +
        "color: #000000;" +
        "alignment: left;" +
        "font-family: sans-serif;' class='paragraph'>" +
        "<p style='padding-top: 3%'>Regards,</p>" +
        "<p>Team Mobidoc</p>" +
        "<a href='https://mobidoc-6a3ac.firebaseapp.com/'><img src='https://i.imgur.com/cL6KJMz.png' alt='Mobidoc Logo' width='40%'>\n" +
        "</a>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 12px; font-weight: 400; line-height: 160%;" +
        "padding-top: 15px;" +
        "color: whitesmoke;" +
        "alignment: left;" +
        "font-style: italic;" +
        "background: #127DB3;" +
        "font-family: sans-serif;' class='paragraph'>" +
        "<p>This email has been automatically generated. Please do not reply to this email</p>" +
        "<p> © Mobidoc 2021</p>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</td></tr></table>" +
        "</body>" +
        "</html>"
    return mail;
}

function GenerateBookingEmailTemplate(Surname,DocName,Date,Time){
    return "<!DOCTYPE html>" +
        "<html lang='en' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'>" +
        "<head>" +
        "<meta http-equiv='content-type' content='text/html; charset=utf-8'>" +
        "<meta name='viewport' content='width=device-width, initial-scale=1.0;'>" +
        "<meta name='format-detection' content='telephone=no'/>" +
        "<style>" +
        "/* Reset styles */ " +
        "body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}" +
        "body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }" +
        "table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }" +
        "img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }" +
        "#outlook a { padding: 0; }" +
        ".ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }" +
        ".ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }\n" +
        "\n" +
        "/* Rounded corners for advanced mail clients only */ " +
        "@media all and (min-width: 560px) {" +
        ".container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px;}" +
        "}" +
        "/* Set color for auto links (addresses, dates, etc.) */ " +
        "a, a:hover {" +
        "color: #127DB3;" +
        "}" +
        ".footer a, .footer a:hover {" +
        "color: #999999;" +
        "}" +
        "</style>\n" +
        "</head>\n" +
        "<body topmargin='0' rightmargin='0' bottommargin='0' leftmargin='0' marginwidth='0' marginheight='0' width='100%' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;\n" +
        "background-color: #F0F0F0;\n" +
        "color: #000000;'" +
        "bgcolor='#f5f5f5;'" +
        "text='#000000'>" +
        "<table width='100%' align='center' border='0' cellpadding='0' cellspacing='0' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;' class='background'><tr><td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;'" +
        "bgcolor='#F0F0F0'>" +
        "<table border='0' cellpadding='0' cellspacing='0' align='center'" +
        "width='602' style='border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;" +
        "max-width: 560px;' class='wrapper'>" +
        "</table>" +
        "<table border='0' cellpadding='0' cellspacing='0' align='center'" +
        "bgcolor='#FFFFFF'" +
        "width='602' style='border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;" +
        "max-width: 560px;' class='container'>" +
        "<tr>" +
        "<td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;" +
        "padding-top: 20px;' class='hero'><img border='0'" +
        "src='https://image.freepik.com/vetores-gratis/gabinete-de-dentista-sala-de-estomatologia-em-clinica-ou-hospital_107791-3788.jpg'" +
        "alt='Please enable images to view this content' title='cancelled appointments'" +
        "width='602' style='" +
        "width: 40%;" +
        "max-width: 602px;" +
        "height: 10%;" +
        "color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;'/></td>" +
        "</tr>" +
        "<tr>" +
        "<td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 20px; font-weight: bold; line-height: 130%;" +
        "color: #000000;" +
        "font-family: sans-serif;' class='header'>" +
        "Appointment Booking" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;" +
        "padding-top: 15px;" +
        "color: #000000;" +
        "alignment: left;" +
        "font-family: sans-serif;' class='paragraph'>" +
        "<p>Dear Mr/Ms " + Surname +  "</p>" +
        "<p style='padding-top: 5%' >We trust this email finds you well.</p>\n" +
        "<p style='padding-top: 3%;padding-bottom: 2%'>Please note that an appointment on <u><b> " + convertDate(Date) + "," + Date + " </b></u> for" + Time + " has been booked , with Dr " + DocName + ".</p>" +
        "<p>Wishing you good health.</p>\n" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;\n" +
        "padding-top: 25px;' class='line'><hr\n" +
        "color='#E0E0E0' align='center' width='100%' size='1' noshade style='margin: 0; padding: 0;' />\n" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;\n" +
        "color: #000000;" +
        "alignment: left;" +
        "font-family: sans-serif;' class='paragraph'>" +
        "<p style='padding-top: 3%'>Regards,</p>" +
        "<p>Team Mobidoc</p>" +
        "<a href='https://mobidoc-6a3ac.firebaseapp.com/'><img src='https://i.imgur.com/cL6KJMz.png' alt='Mobidoc Logo' width='40%'>\n" +
        "</a>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 12px; font-weight: 400; line-height: 160%;" +
        "padding-top: 15px;" +
        "color: whitesmoke;" +
        "alignment: left;" +
        "font-style: italic;" +
        "background: #127DB3;" +
        "font-family: sans-serif;' class='paragraph'>" +
        "<p>This email has been automatically generated. Please do not reply to this email</p>" +
        "<p> © Mobidoc 2021</p>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</td></tr></table>" +
        "</body>" +
        "</html>"
}