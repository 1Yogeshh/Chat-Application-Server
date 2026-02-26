const express = require("express")
const router = express.Router()

const protect = require("../middleware/userMiddleware")
const {
    createUser,
    getMyProfile,
    getUserProfile,
    updateUser,
    searchUser,
    getUsersByIds
} = require("../controllers/user.controller")


router.post("/create", protect, createUser)
router.get("/myprofile", protect, getMyProfile)
router.get("/userProfile/:authUserId", protect, getUserProfile)
router.put("/update", protect, updateUser)
router.get("/search", protect, searchUser)
router.post("/batch", protect, getUsersByIds)
router.get("/health", (req, res) => {
    console.log("hello world")
    res.status(200).json({
        success: true,
        message: "Server is healthy 🚀"
    })
})

module.exports = router