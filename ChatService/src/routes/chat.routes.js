const express = require("express")
const router = express.Router()

const protect = require("../middleware/authMiddlware")
const {
    getPrivateChat,
    sendMessage,
    getMessage,
    getUserChat
} = require("../controllers/chatController")
const validate = require("../middleware/validate.middleware")
const { privateChatSchema, getMessagesSchema } = require("../validators/chat.schema")

router.get("/chats", protect, getUserChat)

router.get("/private/:otherUserId", protect, validate(privateChatSchema), getPrivateChat)

router.post("/send", protect, sendMessage)

router.get("/:chatId", protect, validate(getMessagesSchema), getMessage)


module.exports = router