const { redisSubscriber } = require("../config/redis")
const presence = require("../redis/presence.redis")

module.exports = (io) => {
    redisSubscriber.subscribe("chat-events")

    redisSubscriber.on("message", async (_, raw) => {
        const event = JSON.parse(raw);

        if(event.type==="NEW_MESSAGE"){
            if(await presence.isUserOnline(event.receiverId)){
                const sockets = await presence.getUserSockets(event.receiverId);
                sockets.forEach(sid=>
                    io.to(sid).emit("new-message", event.message)
                )
            }
        }
    })
}