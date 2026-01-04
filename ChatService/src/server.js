require("dotenv").config();
const express = require("express");
const router = require("./routes/chat.routes");

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
