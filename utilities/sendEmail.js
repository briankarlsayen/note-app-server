const nodemailer = require("nodemailer");
const { forgotPassword, registrationReceipt } = require('./emailMessage')
const { MailReceipt } = require('../models')
const crypto = require('crypto')


function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const sendEmail = (options) => {
  const emailId = generateUUID()

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
      htmlMsg = forgotPassword(emailId);
      break;
    default:
      htmlMsg = forgotPassword(emailId);
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
      // const [generatedId] = info.messageId.slice(1,info.messageId.length).split(/@/)
      Date.prototype.addMinutes = function(m) {
        this.setTime(this.getTime() + (m*60*1000));
        return this;
      }
      // * addmin min per num
      const expireTime = new Date().addMinutes(10)

      const receipt = {
        msgId: emailId,
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
