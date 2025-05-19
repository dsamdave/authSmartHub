

const validationLogin = (req, res, next)=>{

    const { email, password } = req.body

    const errors = []

    if(!email){
        errors.push("Please add email!")
    }

    if(!password){
        errors.push("Please enter password!")
    }

    if(errors.length > 0){
        return res.status(400).json({ message: errors})
    }

    next()

}

module.exports = {
    validationLogin
}