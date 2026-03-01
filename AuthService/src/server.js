require("dotenv").config()

const express = require("express")
const prisma = require("./prisma")
const authRoutes = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("./config/redis")

const pinoHttp = require("pino-http")
const logger = require("./config/logger")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use(
    pinoHttp({
        logger,
        customLogLevel: function (res, err) {
            if (res.statusCode >= 500) return "error"
            if (res.statusCode >= 400) return "warn"
            return "info"
        }
    })
)

app.use("/", authRoutes)

app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "Auth Service" })
})

app.get("/db-check", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`
        res.json({ status: "SUCCESS", message: "DB connected ✅" })
    } catch (err) {
        logger.error({ action: "DB_CONNECTION_FAILED", error: err.message })
        res.status(500).json({
            status: "FAILED",
            message: "DB connection failed ❌"
        })
    }
})

app.use((err, req, res, next) => {

    logger.error({
        action: "GLOBAL_ERROR",
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    })

    res.status(400).json({
        success: false,
        message: err.message
    })
})

app.listen(PORT, () => {
    logger.info({
        action: "AUTH_SERVICE_STARTED",
        port: PORT,
        env: process.env.NODE_ENV
    })
})