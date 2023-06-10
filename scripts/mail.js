const nodemailer = require('nodemailer')
require('dotenv').config()

const main = async function(to,token){
    let transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL ,
        pass: process.env.PASS
      },
    });
    let info = await transporter.sendMail({
      from: '"Sameer Yadav" <sameer@user.codes>',
      to: to,
      subject: "Email Verification for Mess App",
      text: "Your OTP is "+token,
      html: "Your OTP is <pre>"+token+"</pre>"
    });
  
    console.log("Message sent: %s", info.messageId);
  }

exports.sendMail = main
