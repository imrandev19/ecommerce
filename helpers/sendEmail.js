const nodemailer = require("nodemailer");
async function sendEmail(email){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_SENDER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_SENDER, // sender address
        to: email, // list of receivers
        subject: "Email Verification", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Email Verification code is 218596</b>", // html body
      });
}

module.exports = sendEmail