const nodemailer = require("nodemailer");

async function sendmail({ from, to, subject, text, html }) {
  
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  //   tls: {
  //     rejectUnauthorized: true
  // }
  });
  try {
    let info = await transporter.sendMail({
      from:`Company < ${from}>`,
      to,
      subject,
      text,
      html,
    });
    return {msg:"success"}
  } catch (error) {
    
    throw new Error("Error in sending mail")
  }
}

module.exports = sendmail;
