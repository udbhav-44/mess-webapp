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
      text: "Your OTP is "+token +"\n This OTP will Expire in 3 Minutes.",
      html: '<style>body {font-family: Arial, sans-serif;background-color: #f6f6f6;margin: 0;padding: 0;}.container {max-width: 600px;margin: 0 auto;padding: 20px;} h1 { color: #333; margin-bottom: 20px;} p {color: #555;margin-bottom: 10px;}.otp {font-size: 24px;font-weight: bold;color: #007bff;}.footer {margin-top: 20px;color: #888;}</style> <div class="container"><h1>Your One-Time Password (OTP)</h1><p>Dear User,</p><p>Your OTP for verification is: <span class="otp">'+token+'</span></p><p>Please enter this OTP to proceed with your action. This OTP will expire in 3 Minutes</p><p class="footer">Thank you!</p></div>'
    });
  
    console.log("Message sent: %s", info.messageId);
  }

exports.sendMail = main
