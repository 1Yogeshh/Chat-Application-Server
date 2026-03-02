require("dotenv").config();
const express = require("express");
const router = require("./routes/chat.routes");
const { redisClient } = require("./config/redis");
const http = require("http");
const initSocket = require("./socket");
const pinoHttp = require("pino-http")
const logger = require("./config/logger")

const app = express();
const port = process.env.PORT || 5002;

app.use(express.json());

app.use(
    pinoHttp({
        logger,
        customLogLevel: function (res, err) {
            if (res.statusCode >= 500) return "error"
            if (res.statusCode >= 400) return "warn"
            return "info"
        }
    })
)

app.use("/", router);

const server = http.createServer(app);

initSocket(server);

const startServer = async () => {

    if (process.env.NODE_ENV !== "production") {

        await redisClient.del("online-users");

        const keys = await redisClient.keys("user:*:sockets");
        for (const key of keys) {
            await redisClient.del(key);
        }
    }
};

startServer();


app.use((err, req, res, next) => {

    logger.error({
        action: "GLOBAL_ERROR",
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    })

    res.status(400).json({
        success: false,
        message: err.message
    })
})

app.listen(port, () => {
    logger.info({
        action: "AUTH_SERVICE_STARTED",
        port: port,
        env: process.env.NODE_ENV
    })
})