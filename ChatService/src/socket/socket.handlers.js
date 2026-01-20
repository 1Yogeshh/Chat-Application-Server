const { message } = require("../config/prisma")
const { redisPublisher } = require("../config/redis")
const presence = require("../redis/presence.redis")
const { sendMessageService, markSeenService } = require("../services/chatService")

module.exports = (socket) => {
    const authUserId = socket.user.authUserId
    console.log("hello world! : ", authUserId)

    presence.userOnline(authUserId, socket.id)

    socket.on("send-message", async ({ chatId, content, receiverId }) => {
        const msg = await sendMessageService({
            chatId,
            senderId: authUserId,
            content
        })

        await redisPublisher.publish("chat-events", JSON.stringify({
            type: "NEW_MESSAGE",
            receiverId,
            message: msg
        }))
    })

    socket.on("mark-seen", async ({ chatId, lastSeenMessageId }) => {
        await markSeenService({
            chatId,
            userId: authUserId,
            lastSeenMessageId
        })

        await redisPublisher.publish("chat-events", JSON.stringify({
            type: "MESSAGE_SEEN",
            chatId,
            lastSeenMessageId,
            userId: authUserId
        }))
    })

    socket.on("disconnect", () =>
        presence.userOffline(authUserId, socket.id)
    )
}