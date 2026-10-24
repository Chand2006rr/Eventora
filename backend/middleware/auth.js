const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User no longer exists" });
    next();
  } catch {
    res.status(401).json({ message: "Session expired. Please log in again." });
  }
};
