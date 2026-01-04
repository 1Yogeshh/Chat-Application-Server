const getPrivateChatService = require("../services/chatService")

const getPrivateChat = async(req, res)=>{
    const chat = await getPrivateChatService(
        req.user.authUserId,
        req.params.otherUserId
    );
    res.json({chat})
}

module.exports = getPrivateChat