const { createClient } = require("redis")

const redisUrl = process.env.REDIS_URL

//client
const redisClient = createClient({
  url: redisUrl
})

//publisher
const redisPublisher = createClient({
  url: redisUrl
})

//subscribe
const redisSubscriber = createClient({
  url: redisUrl
})

redisPublisher.on("connect", () => {
  console.log("Redis Publisher Connected");
});

redisSubscriber.on("connect", () => {
  console.log("Redis Subscriber Connected");
});

redisPublisher.on("error", (err) => {
  console.error("Redis Publisher Error:", err);
});

redisSubscriber.on("error", (err) => {
  console.error("Redis Subscriber Error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis Client Connected");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

(async () => {
  await redisClient.connect();
  await redisPublisher.connect();
  await redisSubscriber.connect();
})();

module.exports = {
  redisClient,
  redisPublisher,
  redisSubscriber
}