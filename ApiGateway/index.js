require("dotenv").config();
const express = require("express")
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(express.json());

// Health check
app.get("/health", (_, res) => {
    res.json({ status: "API Gateway running" });
});

app.listen(process.env.PORT, () => {
  console.log(`🚪 Simple API Gateway running on port ${process.env.PORT}`);
});