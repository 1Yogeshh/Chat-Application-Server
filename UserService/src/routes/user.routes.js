const express = require("express")
const router = express.Router()

const protect = require("../middleware/userMiddleware")
const {
    createUser, 
    getMyProfile, 
    updateUser, 
    blockUser, 
    blockList, 
    unblockUser, 
    checkBlock,
    searchUser
} = require("../controllers/user.controller")


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
router.delete("/unblock/:blockedAuthUserId", protect, unblockUser)

router.get("/blocked/list", protect, blockList)

router.get("/block/check", protect, checkBlock)

router.get("/search", protect, searchUser)


module.exports = router