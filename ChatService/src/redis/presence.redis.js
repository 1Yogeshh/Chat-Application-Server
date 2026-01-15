const { redisPublisher } = require("../config/redis")

exports.userOnline = async (authUserId, socketId) => {
    await redisPublisher.sAdd(`user:${authUserId}:sockets`, socketId);
    await redisPublisher.set(`user:${authUserId}:online`, "true")
}