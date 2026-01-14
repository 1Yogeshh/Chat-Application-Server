require("dotenv").config();
const express = require("express");
const router = require("./routes/chat.routes");
const prisma = require("./prisma");

const http = require("http");
const initSocket = require("./socket");

const app = express();
const port = 5002;

//middleware
app.use(express.json());

//routes
app.use("/chat", router);

//HTTP server banao
const server = http.createServer(app);

//socket attach karo
initSocket(server);

//server start
server.listen(port, () => {
    console.log(`Chat service + Socket.IO started on port ${port}`);
});