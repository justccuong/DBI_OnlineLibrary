require("dotenv").config()

const cors = require("cors")
const express = require("express")

const { connectDB, getDataMode } = require("./src/configs/db")
const authRouter = require("./src/router/authRouter")
const bookRouter = require("./src/router/book")
const libraryRouter = require("./src/router/library")

const app = express()
const PORT = Number(process.env.PORT || 3000)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true
    })
)
app.use(express.json())

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "OnlineLibrary API is running",
        mode: getDataMode(),
    })
})

app.use("/api/auth", authRouter)
app.use("/api/books", bookRouter)
app.use("/api/library", libraryRouter)

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    })
})

app.use((error, req, res, next) => {
    console.error("Unhandled error:", error)
    res.status(error.statusCode || 500).json({
        message: error.message || "Internal server error"
    })
})

;(async () => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${getDataMode()} mode`)
    })
})()
