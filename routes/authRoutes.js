const express = require("express")
const { handleSignUp, handleLogin, handleForgotPassword, handleResetPassword, handleGetUsers } = require("../controllers")
const { validationLogin } = require("../middleware")
const auth = require("../middleware/authenticate")

const router = express.Router()

router.post("/sign-up", handleSignUp   )

router.post("/login", validationLogin, handleLogin)

router.post("/forgot-password", handleForgotPassword)

router.patch("/reset-password", auth, handleResetPassword)

router.get("/get-users", auth,  handleGetUsers)

module.exports = router
