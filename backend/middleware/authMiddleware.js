const jwt = require("jsonwebtoken");


const SECRET_KEY = "mysecretkey";

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // ❌ No token
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Handle "Bearer token"
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, SECRET_KEY);

    // ✅ Attach user to request
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};