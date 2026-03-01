const express = require("express")
const router = express.Router()

const authController = require("../controller/auth.controller")
const protect = require("../middlewares/authMiddleware")
const validate = require("../middlewares/validate.middleware")
const { registerSchema, loginSchema } = require("../validators/auth.schema")

router.post("/register", validate(registerSchema), authController.register)

router.get("/users", authController.getAllUsers)

router.post("/login", validate(loginSchema), authController.login)

router.get("/me", protect, (req, res) => {
    res.json({
        message: "User profile",
        user: req.user,
    })
})

router.post("/refresh-token", authController.refreshToken)

router.post("/logout", authController.logout)

module.exports = router