require("dotenv").config();
const express = require('express');
const prisma = require("./prisma")
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes")
const cors = require("cors");

const app = express()
const port = process.env.PORT || 5001;
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json())
app.use(cookieParser());

app.listen(port, () => {
    console.log(`user service start.... ${port}`)
})

app.use("/", userRoutes)

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