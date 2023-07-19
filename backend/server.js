require('dotenv').config()
const express = require("express")
const app = express()
const PORT= process.env.PORT  || 3500
const userrouter = require("./routes/userroutes")
const mongoose = require('mongoose')
const cors = require('cors')
const notesrouter = require('./routes/noteroutes')

mongoose.connect(process.env.MONGO_URI)

app.use(express.json())

app.use('/users', userrouter)

app.use('/notes', notesrouter)



app.use(cors())

mongoose.connection.once('open', ()=>{
    console.log('connected')
    app.listen(PORT, ()=>{
        console.log("app is listening")
    })
})
