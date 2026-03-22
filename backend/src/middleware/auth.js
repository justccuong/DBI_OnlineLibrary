const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  try {
    // 1. Lấy header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    // 2. Tách token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    // 4. Gắn user vào request
    req.user = decoded; // { id }
    // 5. Cho đi tiếp
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const admin = (req,res,next) =>{
    if(req.user.role !== "admin")
        return res.status(403).send("Admin only")
    next()
}

module.exports = {authMiddleware,admin}

