// const { createClient } = require("redis")

// const redisUrl = process.env.REDIS_URL

// //publisher
// const redisPublisher = createClient({
//     url: redisUrl
// })

// //subscribe
// const redisSubscriber = createClient({
//     url: redisUrl
// })

// redisPublisher.on("connect", () => {
//   console.log("Redis Publisher Connected");
// });

// redisSubscriber.on("connect", () => {
//   console.log("Redis Subscriber Connected");
// });

// redisPublisher.on("error", (err) => {
//   console.error("Redis Publisher Error:", err);
// });

// redisSubscriber.on("error", (err) => {
//   console.error("Redis Subscriber Error:", err);
// });

// (async ()=>{
//     await redisPublisher.connect();
//     await redisSubscriber.connect();
// })();

// module.exports = {
//     redisPublisher,
//     redisSubscriber
// }