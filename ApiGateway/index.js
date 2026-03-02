require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const { getComposedChats } = require("./chat.compose");
const { protect } = require("./middlware/Middleware")

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.get("/health", (req, res) => {
    res.json({ status: "API Gateway running" });
});

app.get("/api/chats", protect, getComposedChats);

app.use(
    "/api/auth",
    createProxyMiddleware({
        target: process.env.AUTH_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            "^/api/auth": ""
        }
    })
);

app.use(
    "/api/users",
    createProxyMiddleware({
        target: process.env.USER_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            "^/api/users": ""
        }
    })
);

app.use(
    "/api/chat",
    createProxyMiddleware({
        target: process.env.CHAT_SERVICE,
        changeOrigin: true,
        pathRewrite: {
            "^/api/chat": ""
        }
    })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚪 API Gateway running on port ${PORT}`);
});