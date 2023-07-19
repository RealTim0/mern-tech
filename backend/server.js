require('dotenv').config()
const express = require("express")
const app = express()
const PORT= process.env.PORT  || 3500
const userrouter = require("./routes/userroutes")
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

mongoose.connect(process.env.MONGO_URI)

app.use(express.json())

app.use('/users', userrouter)



app.use(cors())

mongoose.connection.once('open', ()=>{
    console.log('connected')
    app.listen(PORT, ()=>{
        console.log("app is listening")
    })
})
