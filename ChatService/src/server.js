require("dotenv").config();
const express = require("express");
const router = require("./routes/chat.routes");
const prisma = require("./config/prisma");
const { redisClient } = require("./config/redis"); // 👈 ADD THIS

const http = require("http");
const initSocket = require("./socket");

const app = express();
const port = 5002;

// middleware
app.use(express.json());

// routes
app.use("/", router);

// HTTP server
const server = http.createServer(app);

// socket attach
initSocket(server);

// ✅ SERVER START WITH REDIS CLEAN (DEV ONLY)
const startServer = async() => {

    if (process.env.NODE_ENV !== "production") {
        console.log("🧹 Cleaning Redis presence (DEV MODE)");

        await redisClient.del("online-users");

        const keys = await redisClient.keys("user:*:sockets");
        for (const key of keys) {
            await redisClient.del(key);
        }
    }

    server.listen(port, () => {
        console.log(`🚀 Chat service + Socket.IO started on port ${port}`);
    });
};

startServer();