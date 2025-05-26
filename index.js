const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Auth = require("./models/authModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const routes = require("./routes")

dotenv.config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 8000

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    
    console.log("Mongodb connected...")

    app.listen(PORT, ()=>{
        console.log(`Server running on PORT ${PORT}`)
    })
})



app.use("/api/auth", routes)



