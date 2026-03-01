const {
    getPrivateChatService,
    sendMessageService,
    getMessageService,
    getUserChatService
} = require("../services/chatService")

const chatLogger = require("../logger/chat.logger")


// ================= PRIVATE CHAT =================

const getPrivateChat = async (req, res, next) => {
    try {

        const me = req.user.authUserId
        const other = req.params.otherUserId

        chatLogger.info({
            action: "GET_PRIVATE_CHAT_ATTEMPT",
            requester: me,
            target: other
        })

        const chat = await getPrivateChatService(me, other)

        chatLogger.info({
            action: "GET_PRIVATE_CHAT_SUCCESS",
            chatId: chat.id
        })

        res.json({ chat })

    } catch (err) {

        chatLogger.error({
            action: "GET_PRIVATE_CHAT_ERROR",
            error: err.message
        })

        next(err)
    }
}


// ================= SEND MESSAGE =================

const sendMessage = async (req, res, next) => {
    try {

        const senderId = req.user.authUserId
        const { chatId, content } = req.body

        chatLogger.info({
            action: "SEND_MESSAGE_ATTEMPT",
            chatId,
            senderId
        })

        const msg = await sendMessageService({
            chatId,
            senderId,
            content
        })

        chatLogger.info({
            action: "SEND_MESSAGE_SUCCESS",
            chatId,
            messageId: msg.id
        })

        res.json(msg)

    } catch (err) {

        chatLogger.error({
            action: "SEND_MESSAGE_ERROR",
            error: err.message
        })

        next(err)
    }
}


// ================= GET MESSAGE =================

const getMessage = async (req, res, next) => {
    try {

        const { cursor, limit } = req.query
        const chatId = req.params.chatId
        const userId = req.user.authUserId

        chatLogger.info({
            action: "GET_MESSAGES_ATTEMPT",
            chatId,
            userId,
            cursor,
            limit
        })

        const msg = await getMessageService({
            userId,
            chatId,
            cursor: cursor || undefined,
            limit: limit ? Number(limit) : 20
        })

        chatLogger.info({
            action: "GET_MESSAGES_SUCCESS",
            chatId,
            returnedCount: msg.messages.length
        })

        res.json(msg)

    } catch (err) {

        chatLogger.error({
            action: "GET_MESSAGES_ERROR",
            error: err.message
        })

        next(err)
    }
}


// ================= GET USER CHAT LIST =================

const getUserChat = async (req, res, next) => {
    try {

        const userId = req.user.authUserId

        chatLogger.info({
            action: "GET_USER_CHATS",
            userId
        })

        const chats = await getUserChatService(userId)

        res.json({ chats })

    } catch (err) {

        chatLogger.error({
            action: "GET_USER_CHATS_ERROR",
            error: err.message
        })

        next(err)
    }
}


module.exports = {
    getPrivateChat,
    sendMessage,
    getMessage,
    getUserChat
}