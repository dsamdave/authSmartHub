const jwt = require("jsonwebtoken")
const Auth = require("../models/authModel")

const auth = async(req, res, next)=>{

    const token = req.header("Authorization")

    if(!token){
        return res.status(400).json({message: "Please login!"})
    }

    const rawToken = token.split(" ")

    const userToken = rawToken[1]

    const decodedToken = jwt.verify(userToken, process.env.ACCESSTOKEN)

    const user = await Auth.findById(decodedToken.id)

    // if(user?.role !== "admin"){
    //     return res.status(401).json({messsage: "Invalid Authentication"})
    // }

    console.log({user })

    next()

}

module.exports = auth