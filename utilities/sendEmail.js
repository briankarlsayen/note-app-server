const nodemailer = require("nodemailer");
const { forgotPassword, registrationReceipt } = require('./emailMessage')

const sendEmail = (options) => {
  console.log('options', options)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: true,
    requireTLS: true,
    port: 465,
  });
  
  let htmlMsg;
  switch(options.code) {
    case "RC": 
      htmlMsg = registrationReceipt();
      break;
    case "FP": 
      htmlMsg = forgotPassword();
      break;
    default:
      htmlMsg = forgotPassword();
  }

  const mailOptions = {
    from: `Note-app Team <${process.env.EMAIL_USERNAME}>`,
    to: options.to,
    subject: options.subject,
    html: htmlMsg,
  };
  console.log('mailOptions', mailOptions)
  
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log('err', err);
      return {success: 0, data: err}
    } else {
      console.log('info', info);
      return {success: 1, data: info}
    }
  });
}

module.exports = { sendEmail };
