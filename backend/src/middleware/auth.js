const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing bearer token" })
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

const admin = (req, res, next) => {
    if (String(req.user?.role || "").toLowerCase() !== "admin") {
        return res.status(403).json({ message: "Admin only" })
    }

    next()
}

module.exports = { authMiddleware, admin }
