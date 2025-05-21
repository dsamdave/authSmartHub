const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Auth = require("./models/authModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { sendForgotPasswordEmail } = require("./sendMail")
const { handleGetUsers, handleLogin, handleSignUp, handleForgotPassword, handleResetPassword } = require("./controllers")
const { validationLogin } = require("./middleware")
const auth = require("./middleware/authenticate")

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



app.post("/sign-up", handleSignUp   )


app.post("/login", validationLogin, handleLogin)


app.post("/forgot-password", handleForgotPassword)

app.patch("/reset-password", handleResetPassword)

app.get("/get-users", auth,  handleGetUsers)



