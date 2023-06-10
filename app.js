const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000


app.get('/', (req,res) => {
    res.send('Hii')
})



app.listen(port,() => console.log(`Server is running on http://localhost:${port}`))
