const Auth = require("../models/authModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const handleGetUsers = async(req, res)=>{

    const allUsers = await Auth.find()

    res.status(200).json({
        message: "success", 
        count: allUsers.length,
        allUsers
    })

}

const handleLogin = async (req, res)=>{
    
    const { email, password } = req.body

    const user = await Auth.findOne({ email })

    if(!user){
        return res.status(404).json({message: "User not found."})
    }

    const isMatch = await bcrypt.compare(password, user?.password)

    if(!isMatch){
        return res.status(400).json({message: "Incorrect email or password"})
    }

    // Generate Token

    const accessToken = jwt.sign(

        {id: user?._id},
        process.env.ACCESSTOKEN,
        {expiresIn: "3h"}
    )

    const refreshToken = jwt.sign(
        {id: user?._id},
        process.env.REFRESHTOKEN,
        {expiresIn: "30d"}
    )


    res.status(200).json({
        message: "Login successful",
        accessToken,
        user: {
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName,
            state: user?.state
        }
    })


}

const handleSignUp = async (req, res)=>{

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

} 

const handleForgotPassword = async(req, res)=>{

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

}

const handleResetPassword = async(req, res)=>{

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


}


module.exports = {
    handleGetUsers,
    handleLogin,
    handleSignUp,
    handleForgotPassword,
    handleResetPassword
}