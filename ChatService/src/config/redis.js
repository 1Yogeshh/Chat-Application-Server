const { createClient } = require("redis")

const redis = createClient({
    url: process.env.REDIS_URL
})

redis.on("connect",()=>{
    console.log("redis connected")
})

redis.on("error",(err)=>{
    console.log("Redis Error", err)
})

redis.connect()

module.exports = redis