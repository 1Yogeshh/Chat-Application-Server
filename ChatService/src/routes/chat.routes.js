const express = require("express")
const router = express.Router()

const protect = require("../middleware/authMiddlware")
const {getPrivateChat, sendMessage} = require("../controllers/chatController")

router.get("/me", protect, (req, res) => {
    res.json({
        message: "User profile",
        user: req.user,
    })
})

//route of private chat
router.get("/private/:otherUserId", protect,getPrivateChat)

//router of send message
router.post("/send", protect, sendMessage )

module.exports = router