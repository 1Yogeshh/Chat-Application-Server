const express = require('express');
const prisma = require("./prisma")

const app = express()
const port = 5001

app.listen(port, ()=>{
    console.log(`user service start.... ${port}`)
})

app.get("/db-check", async(req, res)=>{
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