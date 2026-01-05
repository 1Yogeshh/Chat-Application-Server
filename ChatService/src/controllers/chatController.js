const {getPrivateChatService,sendMessageService} = require("../services/chatService")

//controller of private chat
const getPrivateChat = async(req, res)=>{
    const chat = await getPrivateChatService(
        req.user.authUserId,
        req.params.otherUserId
    );
    res.json({chat})
}

const sendMessage = async(req, res)=>{
    const msg = await sendMessageService({
        chatId: req.body.chatId,
        senderId: req.user.authUserId,
        content:req.body.content
    })
    res.json(msg)
}

module.exports = {getPrivateChat, sendMessage}