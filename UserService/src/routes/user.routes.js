const express = require("express")
const router = express.Router()

const protect = require("../middleware/userMiddleware")
const {
    createUser,
    getMyProfile,
    getUserProfile,
    updateUser,
    blockUser,
    blockList,
    unblockUser,
    checkBlock,
    searchUser,
    getUsersByIds
} = require("../controllers/user.controller")


router.post("/create", protect, createUser)
router.get("/myprofile", protect, getMyProfile)
router.get("/userProfile/:authUserId", protect, getUserProfile)
router.put("/update", protect, updateUser)

router.post("/block/:blockedAuthUserId", protect, blockUser)
router.delete("/unblock/:blockedAuthUserId", protect, unblockUser)

router.get("/blocked/list", protect, blockList)

router.get("/block/check", protect, checkBlock)

router.get("/search", protect, searchUser)

router.post("/batch", protect, getUsersByIds)

router.get("/health", console.log("hello world"))


module.exports = router