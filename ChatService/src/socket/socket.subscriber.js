const { redisSubscriber } = require("../config/redis")
const presence = require("../redis/presence.redis")

module.exports = async (io) => {
    await redisSubscriber.subscribe("chat-events", async (message) => {
        const event = JSON.parse(message);

        // new message
        if (event.type === "NEW_MESSAGE") {
            if (await presence.isUserOnline(event.receiverId)) {
                const sockets = await presence.getUserSockets(event.receiverId);

                sockets.forEach((sid) => {
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

    });
}