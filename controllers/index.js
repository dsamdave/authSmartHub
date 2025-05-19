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
        {expiresIn: "5m"}
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


module.exports = {
    handleGetUsers,
    handleLogin
}