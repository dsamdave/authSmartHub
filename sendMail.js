

const nodemailer = require("nodemailer")


const sendForgotPasswordEmail = async (email, token)=>{

    const mailTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
        }
    })

    const mailDetails = {
        from: `${process.env.EMAIL}`,
        to: email,
        subject: "Forget Password Request",
        html: `
        <div> Click on this button to reset your password
        <h1>${token}</h1>
        
        </div>`
    }

    await mailTransport.sendMail(mailDetails)

}





module.exports = {
    sendForgotPasswordEmail
}