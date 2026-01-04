const getPrivateChatService = require("../services/chatService")

//controller of private chat
const getPrivateChat = async(req, res)=>{
    const chat = await getPrivateChatService(
        req.user.authUserId,
        req.params.otherUserId
    );
    res.json({chat})
}

module.exports = getPrivateChat