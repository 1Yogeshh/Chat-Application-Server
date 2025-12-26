const express = require('express');
const prisma = require("./prisma")
const authRoutes = require("./routes/auth.routes")
const cookieParser = require("cookie-parser");
require("./config/redis")

const app = express()
const port = 5000

app.use(express.json())
app.use(cookieParser()); 

app.listen(port,()=>{
    console.log(`server start successfully! ${port}`)
})

app.use("/auth", authRoutes);

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
});
