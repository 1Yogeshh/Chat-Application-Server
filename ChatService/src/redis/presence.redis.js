// const { redisClient } = require("../config/redis")

// const ONLINE_USERS_KEY = "online-users";

// //User Online
// exports.userOnline = async (userId, socketId) => {
//     await redisClient.sAdd(`user:${userId}:sockets`, socketId);
//     // add to global online set
//     await redisClient.sAdd(ONLINE_USERS_KEY, userId);

//     await redisClient.set(`user:${userId}:online`, "true")

//     // safety TTL (optional but recommended)
//     await redisClient.expire(`user:${userId}:sockets`, 60 * 60 * 24); // 1 day
//     await redisClient.expire(`user:${userId}:online`, 60 * 60 * 24);
// }

// //User Offline
// exports.userOffline = async (userId, socketId) => {
//     const socketKey = `user:${userId}:sockets`
//     const onlineKey = `user:${userId}:online`
//     const lastSeenKey = `user:${userId}:lastSeen`
//     await redisClient.sRem(socketKey, socketId)

//     const count = await redisClient.sCard(socketKey)

//     //last socket disconnected
//     if (count === 0) {
//         await redisClient.del(socketKey)
//         await redisClient.sRem(ONLINE_USERS_KEY, userId);
//         await redisClient.set(onlineKey, "false", "EX", 60 * 60 * 24 * 7)
//         await redisClient.set(lastSeenKey, Date.now(), "EX", 60 * 60 * 24 * 30)
//     }
// }

// //Check User Online
// exports.isUserOnline = async (userId) => {
//     const status = await redisClient.get(`user:${userId}:online`);
//     return status === "true";
// }

// //Get User Sockets
// exports.getUserSockets = async (userId) => {
//     return redisClient.sMembers(`user:${userId}:sockets`)
// }

// //Get Last Seen
// exports.getLastSeen = async (userId) => {
//     return redisClient.get(`user:${userId}:lastSeen`)
// }

// // 🔥 GET ALL ONLINE USERS (IMPORTANT)
// exports.getOnlineUsers = async () => {
//     return await redisClient.sMembers(ONLINE_USERS_KEY);
// };


const { redisClient } = require("../config/redis");

const ONLINE_USERS_KEY = "online-users";

// User Online
exports.userOnline = async(userId, socketId) => {
    await redisClient.sAdd(`user:${userId}:sockets`, socketId);
    await redisClient.sAdd(ONLINE_USERS_KEY, userId);

    await redisClient.expire(`user:${userId}:sockets`, 60 * 60 * 24);
};

// User Offline
exports.userOffline = async(userId, socketId) => {
    const socketKey = `user:${userId}:sockets`;
    const lastSeenKey = `user:${userId}:lastSeen`;

    await redisClient.sRem(socketKey, socketId);

    const count = await redisClient.sCard(socketKey);

    if (count === 0) {
        await redisClient.del(socketKey);
        await redisClient.sRem(ONLINE_USERS_KEY, userId);
        await redisClient.set(lastSeenKey, Date.now(), "EX", 60 * 60 * 24 * 30);
    }
};

// ✅ Source of truth = socket count
exports.isUserOnline = async(userId) => {
    const count = await redisClient.sCard(`user:${userId}:sockets`);
    return count > 0;
};

exports.getUserSockets = async(userId) => {
    return redisClient.sMembers(`user:${userId}:sockets`);
};

exports.getLastSeen = async(userId) => {
    return redisClient.get(`user:${userId}:lastSeen`);
};

exports.getOnlineUsers = async() => {
    return redisClient.sMembers(ONLINE_USERS_KEY);
};