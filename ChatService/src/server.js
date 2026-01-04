require("dotenv").config();
const express = require("express");
const router = require("./routes/chat.routes");
const prisma = require("./prisma")

const app = express();
const port = 5002;

// middleware
app.use(express.json());

// routes
app.use("/chat", router);

// health check (optional but recommended)
app.get("/health", (req, res) => {
  res.json({ status: "Chat service running" });
});

// start server
app.listen(port, () => {
  console.log(`Chat service started on port ${port}`);
});

app.get("/db-check", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("hello world!")
    res.json({ status: "SUCCESS", message: "DB connected ✅" });
  } catch (err) {
    res.status(500).json({
      status: "FAILED",
      message: "DB connection failed ❌",
      error: err.message,
    });
  }
})
