const { getPrivateChatService, sendMessageService, getMessageService } = require("../services/chatService")

//controller of private chat
const getPrivateChat = async (req, res) => {
    const chat = await getPrivateChatService(
        req.user.authUserId,
        req.params.otherUserId
    );
    res.json({ chat })
}

//controller of send message
const sendMessage = async (req, res) => {
    const msg = await sendMessageService({
        chatId: req.body.chatId,
        senderId: req.user.authUserId,
        content: req.body.content
    })
    res.json(msg)
}

//controller of get message
const getMessage = async (req, res) => {
    const msg = await getMessageService({
        userId: req.user.authUserId,
        chatId: req.params.chatId
    })

    res.json(msg)
}


module.exports = { getPrivateChat, sendMessage, getMessage }