const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const otpGenerator = require('otp-generator');
const { sendMail } = require('./scripts/mail')
require('dotenv').config()

const app = express()
var sess = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,maxAge:30*24*60*60*1000 }
  }
if (app.get('env')==='production'){
    app.set('trust proxy',1)
    sess.cookie.secure = true
}
app.use(session(sess))
const port = process.env.PORT || 3000

const dbUrl = "mongodb+srv://admin:"+process.env.DBPASS+"@cluster0.okpzlrj.mongodb.net/?retryWrites=true&w=majority"
createConnection().then(() => console.log('Connected to Database')).catch(err => console.log(err))
async function createConnection() {
    await mongoose.connect(dbUrl)
}

const userSchema = new mongoose.Schema({
    name: String,
    roll: Number,
    email: String
})

const User = mongoose.model('User',userSchema)

async function getEmail(roll) {
    const detail =  await User.findOne({roll:roll})
    return detail.email
}

app.listen(port,() => console.log(`Server is running on http://localhost:${port}`))
