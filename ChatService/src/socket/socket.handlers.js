const { message } = require("../config/prisma")
const { redisPublisher } = require("../config/redis")
const presence = require("../redis/presence.redis")
const { sendMessageService } = require("../services/chatService")

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

        redisPublisher.publish("chat-events", JSON.stringify({
            type: "NEW_MESSAGE",
            receiverId,
            message: msg
        }))
    })

    socket.on("disconnect", () =>
        presence.userOffline(authUserId, socket.id)
    )
}