require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const { getComposedChats } = require("./chat.compose");
const { protect } = require("./middlware/Middleware")

const app = express();
// app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// ✅ Health Check
app.get("/health", (req, res) => {
    res.json({ status: "API Gateway running" });
});

// ⚠️ CUSTOM ROUTE (ABOVE PROXIES)
app.get("/api/chats", protect, getComposedChats);

// 🔐 AUTH SERVICE
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

// 👤 USER SERVICE
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

// 💬 CHAT SERVICE
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