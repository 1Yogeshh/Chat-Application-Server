const express = require("express")
const router = express.Router()

const protect = require("../middleware/userMiddleware")
const {createUser, getMyProfile} = require("../controllers/user.controller")


router.get("/me", protect,(req, res)=>{
    res.json({
        message: "User profile",
        user: req.user,
    })
} )

router.post("/create", protect, createUser  )
router.get("/myprofile", protect, getMyProfile)


module.exports = router