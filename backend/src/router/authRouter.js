const express = require("express")

const { authMiddleware } = require("../middleware/auth")
const { registerUser, loginUser, getUserById } = require("../services/authService")

const authRouter = express.Router()

authRouter.post("/register", async (req, res) => {
    try {
        const { userName, email, password } = req.body
        const user = await registerUser(userName, email, password)

        res.status(201).json({
            message: "Register success",
            user
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "System error"
        })
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await loginUser(email, password)

        res.status(200).json({
            message: "Login success",
            ...result
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "System error"
        })
    }
})

authRouter.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await getUserById(req.user.userId)
        res.status(200).json({ user })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "System error"
        })
    }
})

module.exports = authRouter
