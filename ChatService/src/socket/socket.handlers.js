const { message } = require("../config/prisma")
const { redisPublisher } = require("../config/redis")
const presence = require("../redis/presence.redis")
const { sendMessageService, markSeenService } = require("../services/chatService")

module.exports = (socket) => {
    const userId = socket.user.userId

    presence.userOnline(userId, socket.id)

    //send message
    socket.on("send-message", async ({ chatId, content, receiverId }) => {
        const msg = await sendMessageService({
            chatId,
            senderId: userId,
            content
        })

        await redisPublisher.publish("chat-events", JSON.stringify({
            type: "NEW_MESSAGE",
            receiverId,
            message: msg
        }))
    })

    //mark seen message 
    socket.on("mark-seen", async ({ chatId, lastSeenMessageId }) => {
        await markSeenService({
            chatId,
            userId: userId,
            lastSeenMessageId
        })

        await redisPublisher.publish("chat-events", JSON.stringify({
            type: "MESSAGE_SEEN",
            chatId,
            lastSeenMessageId,
            userId: userId
        }))
    })

    socket.on("disconnect", () =>
        presence.userOffline(userId, socket.id)
    )
}