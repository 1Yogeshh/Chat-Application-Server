const { redisSubscriber } = require("../config/redis")
const presence = require("../redis/presence.redis")

module.exports = async(io) => {
    await redisSubscriber.subscribe("chat-events", async(message) => {
        const event = JSON.parse(message);

        // new message
        if (event.type === "NEW_MESSAGE") {

            if (await presence.isUserOnline(event.receiverId)) {
                const receiverSockets = await presence.getUserSockets(event.receiverId);

                receiverSockets.forEach((sid) => {
                    io.to(sid).emit("new-message", event.message);
                });
            }

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

        if (event.type === "USER_ONLINE" || event.type === "USER_OFFLINE") {
            const users = await presence.getOnlineUsers();
            io.emit("online-users-list", users);
        }

        if (event.type === "ONLINE_LIST_UPDATE") {
            io.emit("online-users-list", event.users);
        }

    });
}