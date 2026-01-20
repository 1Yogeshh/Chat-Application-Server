const express = require("express")
const router = express.Router()

const protect = require("../middleware/authMiddlware")
const { 
    getPrivateChat, 
    sendMessage, 
    getMessage, 
    getUserChat 
} = require("../controllers/chatController")

router.get("/me", protect, (req, res) => {
    res.json({
        message: "User profile",
        user: req.user,
    })
})

//get of private chat and create
router.get("/private/:otherUserId", protect, getPrivateChat)

//send message
router.post("/send", protect, sendMessage)

//get specific chat
router.get("/:chatId", protect, getMessage)

//get all chats
router.get("/chats", protect, getUserChat)

module.exports = router