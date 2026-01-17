const { redisClient } = require("../config/redis")

//User Online
exports.userOnline = async (authUserId, socketId) => {
    await redisClient.sAdd(`user:${authUserId}:sockets`, socketId);
    await redisClient.set(`user:${authUserId}:online`, "true")

    // safety TTL (optional but recommended)
    await redisClient.expire(`user:${authUserId}:sockets`, 60 * 60 * 24); // 1 day
    await redisClient.expire(`user:${authUserId}:online`, 60 * 60 * 24);
}

//User Offline
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

//Check User Online
exports.isUserOnline = async (authUserId) => {
    const status = await redisClient.get(`user:${authUserId}:online`);
    return status === "true";
}

//Get User Sockets
exports.getUserSockets = async (authUserId) => {
    return redisClient.sMembers(`user:${authUserId}:sockets`)
}

//Get Last Seen
exports.getLastSeen = async (authUserId) => {
    return redisClient.get(`user:${authUserId}:lastSeen`)
}