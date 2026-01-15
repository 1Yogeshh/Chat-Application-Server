const {redisPublisher} = require("../config/redis")
const presence = require("../redis/presence.redis")

module.exports=(socket)=>{
    const authUserId = socket.user.authUserId
    console.log("hello world! : ",authUserId)

    presence.userOnline(authUserId, socket.id)
}