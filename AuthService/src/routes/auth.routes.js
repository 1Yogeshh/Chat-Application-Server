const express = require("express")
const router = express.Router()

const authController = require("../controller/auth.controller")

router.post("/register", authController.register)

router.get("/users", authController.getAllUsers)

router.post("/login", authController.login)

module.exports = router