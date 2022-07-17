const nodemailer = require("nodemailer");
const { forgotPassword, registrationReceipt } = require('./emailMessage')
const { MailReceipt } = require('../models')

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
  
  transporter.sendMail(mailOptions, async function (err, info) {
    if (err) {
      console.log('err', err);
      MailReceipt.create()
      return {success: 0, data: err}
    } else {
      const [generatedId] = info.messageId.slice(1,info.messageId.length).split(/@/)
      Date.prototype.addMinutes = function(m) {
        this.setTime(this.getTime() + (m*60*1000));
        return this;
      }
      // * addmin min per num
      const expireTime = new Date().addMinutes(1)

      const receipt = {
        msgId: generatedId,
        to: options.to,
        subject: options.subject,
        code: options.code,
        expires: expireTime,
      }
      const createMailReceipt = await MailReceipt.create(receipt)
      console.log('info', info);
      return {success: 1, data: info}
    }
  });
}

module.exports = { sendEmail };
