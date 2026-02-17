const { redisSubscriber } = require("../config/redis")
const presence = require("../redis/presence.redis")

module.exports = async(io) => {
    await redisSubscriber.subscribe("chat-events", async(message) => {
        const event = JSON.parse(message);

        // new message
        if (event.type === "NEW_MESSAGE") {

            // 1️⃣ Receiver
            if (await presence.isUserOnline(event.receiverId)) {
                const receiverSockets = await presence.getUserSockets(event.receiverId);

                receiverSockets.forEach((sid) => {
                    io.to(sid).emit("new-message", event.message);
                });
            }

            // 2️⃣ Sender (IMPORTANT 🔥)
            if (await presence.isUserOnline(event.message.senderId)) {
                const senderSockets = await presence.getUserSockets(event.message.senderId);

                senderSockets.forEach((sid) => {
                    io.to(sid).emit("new-message", event.message);
                });
            }
        }


        //message seen
        if (event.type === "MESSAGE_SEEN") {
            io.to(event.chatId).emit("message-seen", {
                chatId: event.chatId,
                lastSeenMessageId: event.lastSeenMessageId,
                userId: event.userId
            })
        }

        //User Online
        if (event.type === "USER_ONLINE") {
            io.emit("user-online", {
                userId: event.userId,
            })
        }

        //User Offline
        if (event.type === "USER_OFFLINE") {
            io.emit("user-offline", {
                userId: event.userId,
            })
        }

    });
}