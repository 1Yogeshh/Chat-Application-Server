const express = require("express")
const router = express.Router()

const protect = require("../middleware/userMiddleware")
const {createUser, getMyProfile, updateUser, blockUser, blockList} = require("../controllers/user.controller")


router.get("/me", protect,(req, res)=>{
    res.json({
        message: "User profile",
        user: req.user,
    })
} )

router.post("/create", protect, createUser  )
router.get("/myprofile", protect, getMyProfile)
router.put("/update", protect, updateUser)

router.post("/block/:blockedAuthUserId", protect, blockUser)

router.get("/blocked/list", protect, blockList)


module.exports = router