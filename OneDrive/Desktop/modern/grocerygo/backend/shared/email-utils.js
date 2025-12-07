const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD,
    },
});

async function sendEmail(to, subject , text) {
    if(!to) throw new Error("Recipient email required");
    if(!subject) throw new Error("Email subject required");
    if(!text) throw new Error("Email text required");

    const mailOptions = {
        from: process.env.GOOGLE_EMAIL,
        to,
        subject,
        text,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
}

module.exports =  {sendEmail} ;