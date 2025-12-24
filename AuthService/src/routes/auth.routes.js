const express = require("express")
const router = express.Router()

const authController = require("../controller/auth.controller")
const protect = require("../middlewares/authMiddleware")

router.post("/register", authController.register)

router.get("/users", authController.getAllUsers)

router.post("/login", authController.login)

router.get("/me", protect,(req, res)=>{
    res.json({
        message: "User profile",
        user: req.user,
    })
} )

module.exports = router