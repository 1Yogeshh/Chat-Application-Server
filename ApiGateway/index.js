require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
// app.use(express.json());

// ✅ Health Check
app.get("/health", (req, res) => {
  res.json({ status: "API Gateway running" });
});

// 🔐 AUTH SERVICE
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE, // http://localhost:5000
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
    target: process.env.USER_SERVICE, // http://localhost:5001
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
    target: process.env.CHAT_SERVICE, // http://localhost:5002
    changeOrigin: true,
    pathRewrite: {
      "^/api/chat": ""
    }
  })
);

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`🚪 API Gateway running on port ${PORT}`);
});
