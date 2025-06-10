const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: verified.userId, role: verified.role };
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = auth; 