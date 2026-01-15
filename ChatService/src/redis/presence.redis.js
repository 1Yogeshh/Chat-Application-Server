const { redisClient } = require("../config/redis")

exports.userOnline = async (authUserId, socketId) => {
    await redisClient.sAdd(`user:${authUserId}:sockets`, socketId);
    await redisClient.set(`user:${authUserId}:online`, "true")
}