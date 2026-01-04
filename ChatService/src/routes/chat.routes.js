const express = require("express")
const router = express.Router()

const protect = require("../middleware/authMiddlware")
const getPrivateChat = require("../controllers/chatController")

router.get("/me", protect, (req, res) => {
    res.json({
        message: "User profile",
        user: req.user,
    })
})

router.get("/private/:otherUserId", protect,getPrivateChat)

module.exports = router