require("dotenv").config();
const nodemailer = require("nodemailer");
const mailgen = require("mailgen");
const optVerification = require("./models/otp");
const config = {
    service: "gmail",
    auth: {
        user: "r3c0nm3.303@gmail.com",
        pass: "yopy wnbw xrbp covo"
    }
}
const transporter = nodemailer.createTransport(config);
const mailGenerator = new mailgen({
    theme: 'salted',
    product: {
        // Optional product logo
        // Appears in header & footer of e-mails
        name: 'R3C0N-M3',
        link: 'https://github.com/kartikkc/recon-me',
        // logo: 'https://i.imgur.com/bynWTBo.png'
    }
});



async function main(otp) {
    var email = {
        body: {
            name: 'Kartik',
            intro: 'Welcome to R3C0N-M3! We\'re very excited to have you on board.',
            action: {
                instructions: 'To Verify your Account, please enter the OTP on the site:',
                button: {
                    color: '#22BC66',
                    text: otp
                }
            },
            outro: 'Don\'t Reply to this email. Please generate another OTP from the website.'
        }
    };
    
    // Generate an HTML email with the provided contents
    var emailBody = mailGenerator.generate(email);

    const mail = {
        from: "R3C0N-M3",
        to: "kartikkc95@gmail.com",
        subject: "Hello",
        text: "hello mailer",
        html: emailBody
    };
    const sendmail = await transporter.sendMail(mail);
    console.log("message sent: " + sendmail.id);

}

module.exports = main;