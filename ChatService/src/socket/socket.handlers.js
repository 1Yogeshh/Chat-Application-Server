const { message } = require("../config/prisma")
const { redisPublisher } = require("../config/redis")
const presence = require("../redis/presence.redis")
const { sendMessageService, markSeenService } = require("../services/chatService")

module.exports = async (socket) => {
    const userId = socket.user.userId

    await presence.userOnline(userId, socket.id);

    await redisPublisher.publish(
        "chat-events",
        JSON.stringify({
            type: "USER_ONLINE",
            userId,
        })
    );

    // 🔥 INITIAL SYNC
    // socket.on("get-online-users", async () => {
    //     const users = await presence.getOnlineUsers();
    //     console.log("❤️❤️online: ", users)
    //     socket.emit("online-users-list", users);
    // });

    // after userOnline
    const users = await presence.getOnlineUsers();
    socket.emit("online-users-list", users);

    socket.on("join-chat", (chatId) => {
        socket.join(chatId);
    });

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

    socket.on("disconnect", async () => {
        await presence.userOffline(userId, socket.id);

        const stillOnline = await presence.isUserOnline(userId);

        if (!stillOnline) {
            await redisPublisher.publish(
                "chat-events",
                JSON.stringify({
                    type: "USER_OFFLINE",
                    userId,
                })
            );
        }
    });
}