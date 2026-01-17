const { redisSubscriber } = require("../config/redis")
const presence = require("../redis/presence.redis")

module.exports = async (io) => {
    await redisSubscriber.subscribe("chat-events", async (message) => {
        const event = JSON.parse(message);

        if (event.type === "NEW_MESSAGE") {
            if (await presence.isUserOnline(event.receiverId)) {
                const sockets = await presence.getUserSockets(event.receiverId);

                sockets.forEach((sid) => {
                    io.to(sid).emit("new-message", event.message);
                });
            }
        }
    });
}