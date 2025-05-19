const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Auth = require("./models/authModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { sendForgotPasswordEmail } = require("./sendMail")
const { handleGetUsers, handleLogin } = require("./controllers")
const { validationLogin } = require("./middleware")

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



app.post("/sign-up", async (req, res)=>{

    const { email, password, firstName, lastName, state } = req.body

    if(!email){
        return res.status(400).json({message: "Please enter email"})
    }

    if(!password){
     return res.status(400).json({message: "Please enter password"})
    }

    const existingUser = await Auth.findOne({ email })

    if(existingUser){
        return res.status(400).json({message: "User account already exist!"})
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new Auth({ 
        email, 
        password:hashedPassword, 
        firstName, 
        lastName, 
        state 
    })

    await newUser.save()

    res.status(201).json({
        message: "Account created successfully",
        user: {
            email, firstName, lastName, state
        }
    })

}    )


app.post("/login", validationLogin, handleLogin)


app.post("/forgot-password", async(req, res)=>{

    const { email } = req.body

    const user = await Auth.findOne({ email })

    if(!user){
        return res.status(404).json({message: "User not found"})
    }

    // Send user an email
    const accessToken = jwt.sign(
        {id: user?._id},
        `${process.env.ACCESSTOKEN}`,
        {expiresIn: "2h"}
    )

    if(email){
        await sendForgotPasswordEmail(email, accessToken)
    }

    res.status(200).json({message: "Please check your email"})

})

app.patch("/reset-password", async(req, res)=>{

    const { password, email } = req.body

    const user = await Auth.findOne({ email })

    if(!user){
        return res.status(404).json({message: "User not found"})
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    user.password = hashedPassword

    await user.save()

    res.status(200).json({
        message: "Password updated successfully",
    })


})

app.get("/get-users",  handleGetUsers)



