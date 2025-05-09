const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Auth = require("./authModel")
const bcrypt = require("bcryptjs")

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

})
