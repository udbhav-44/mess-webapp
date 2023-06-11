const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const otpGenerator = require('otp-generator')
const { sendMail } = require('./scripts/mail')
require('dotenv').config()

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.set('view engine', 'ejs');
const port = process.env.PORT || 3000

const dbUrl = "mongodb+srv://admin:"+process.env.DBPASS+"@cluster0.okpzlrj.mongodb.net/?retryWrites=true&w=majority"
createConnection().then(() => console.log('Connected to Database')).catch(err => console.log(err))
async function createConnection() {
    await mongoose.connect(dbUrl)
}

const userSchema = new mongoose.Schema({
    name: String,
    roll: Number,
    email: String,
    otp : {data: String,time:Date} 
})

const hallSchema = new mongoose.Schema({
    hallShop: {
        type: String,
        enum: ['13-1','13-2','4-1','4-2'],
        required: true
    },
    date : {
        type: Number,
        enum: [...Array(31)].map((_, index) => index + 1),
        required: true
    },
    month : {
        type: Number,
        enum:[0,1,2,3,4,5,6,7,8,9,10,11],
        required: true
    },
    year : {
        type:Number,
        required:true,
        enum:[2023,2024,2025]
    },
    id : {
        type: String,
        required: true
    },
    price : {
        type: Number
    }

})

const User = mongoose.model('User',userSchema)
const Hall = mongoose.model('Hall',hallSchema)

async function getEmail(roll) {
    const detail =  await User.findOne({roll:roll})
    return detail.email
}

const calculatePriceSumForMonth = async (id, month,year) => {
    try {
      const result = await Hall.aggregate([
        {
          $match: {
            id: id,
            month:month,
            year:year
          }
        },
        {
          $group: {
            _id: null,
            totalPrice: { $sum: "$price" }
          }
        }
      ]);
  
      if (result.length > 0) {
        return result[0].totalPrice;
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Error calculating price sum for month:", error);
      throw error;
    }
  };
  
  

// Route that will generate OTP
app.post('/authenticate/generateOTP',async (req,res) => {
    const roll = parseInt(req.body.roll)
    const otp = otpGenerator.generate(6,{specialChars:false,upperCaseAlphabets:false,lowerCaseAlphabets:false})
    const now = new Date()
    const time = now.getTime()
    getEmail(roll).then(async (email) => {
        sendMail(email,otp).then( async () => {
            console.log('OTP Send Successfully')
            await User.findOneAndUpdate({roll:roll},{otp:{data:otp,time:time}}).catch(err => {console.log(err);res.json({'status':false});return})
            res.json({'status':true})
        }).catch(err => {console.log(err);res.json({'status':false})})
    }).catch(err => {console.log(err);res.json({'status':false})})
    return
})

// Route to verify OTP
app.post('/authenticate',async (req,res) => {
    const roll = parseInt(req.body.roll)
    const otp = req.body.otp
    const now = new Date()
    const time = now.getTime()

    const student = await User.findOne({roll:roll})
    const otpSent = student.otp
    const timeDiff = (time - otpSent.time)/(1000*60)

    if (otp===otpSent.data && timeDiff <= 3) {
        res.json({'authenticated':true,'id':student._id.toString()})
        return
    }
    else {
        res.json({'authenticated':false})
        return
    }
})

// Route to register payments
app.post('/pay', async (req,res) => {
    const id = req.body.studentId
    const hallShop = req.body.hall +'-'+ req.body.shop
    const amount = req.body.amount
    const now = new Date()
    const date = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()
    Hall.create({hallShop:hallShop,id:id,date:date,month:month,year:year,price:amount}).then(() => res.json({'status':true})).catch((err) => {console.log(err);res.json({'status':false})})
})



app.get('/',async (req,res) => {
    if (req.cookies.token) {
        const id = req.cookies.token
        const user = await User.findById(id)
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()
        const totalPrice = await calculatePriceSumForMonth(id,currentMonth,currentYear)
        res.render('main',{name:user.name,roll:user.roll,monthlyExpense:totalPrice})
    } else {
        res.render('index')
    }
})

app.listen(port,() => console.log(`Server is running on http://localhost:${port}`))
