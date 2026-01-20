require("dotenv").config();
const express = require("express")
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(express.json());

// Health check
app.get("/health", (_, res) => {
    res.json({ status: "API Gateway running" });
});

// AUTH SERVICE
app.use(
    "/api/auth",
    createProxyMiddleware({
        target: process.env.AUTH_SERVICE,
        changeOrigin: true,
        pathRewrite: { "^/api/auth": "" }
    })
);

// USER SERVICE
app.use(
    "/api/users",
    createProxyMiddleware({
        target: process.env.USER_SERVICE,
        changeOrigin: true,
        pathRewrite: { "^/api/users": "" }
    })
);

// CHAT SERVICE (REST only)
app.use(
    "/api/chat",
    createProxyMiddleware({
        target: process.env.CHAT_SERVICE,
        changeOrigin: true,
        pathRewrite: { "^/api/chat": "" }
    })
);

app.listen(process.env.PORT, () => {
    console.log(`🚪 Simple API Gateway running on port ${process.env.PORT}`);
});