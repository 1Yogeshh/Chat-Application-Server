const express = require("express")
const router = express.Router()

const protect = require("../middleware/userMiddleware")


router.get("/me", protect,(req, res)=>{
    res.json({
        message: "User profile",
        user: req.user,
    })
} )


module.exports = router