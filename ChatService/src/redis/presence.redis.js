const { redisClient } = require("../config/redis")

exports.userOnline = async (authUserId, socketId) => {
    await redisClient.sAdd(`user:${authUserId}:sockets`, socketId);
    await redisClient.set(`user:${authUserId}:online`, "true")

    // safety TTL (optional but recommended)
    await redis.expire(`user:${authUserId}:sockets`, 60 * 60 * 24); // 1 day
    await redis.expire(`user:${authUserId}:online`, 60 * 60 * 24);
}

exports.userOffline = async (authUserId, socketId) => {
    const socketKey = `user:${authUserId}:sockets`
    const onlineKey = `user:${authUserId}:online`
    const lastSeenKey = `user:${authUserId}:lastSeen`
    await redisClient.sRem(socketKey, socketId)

    const count = await redisClient.sCard(socketKey)

    //last socket disconnected
    if (count === 0) {
        await redisClient.del(socketKey)
        await redisClient.set(onlineKey, "false", "EX", 60 * 60 * 24 * 7)
        await redisClient.set(lastSeenKey, Date.now(), "EX", 60 * 60 * 24 * 30)
    }
}