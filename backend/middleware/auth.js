const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
    const authHeader = req.headers.authorization;
    console.log('Auth middleware - Authorization header:', authHeader);
    
    const token = authHeader?.split(" ")[1];
    console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ message: "Access Denied" });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth middleware - Token verified:', verified);
      
      if (!verified || !verified.id) {
        console.log('Auth middleware - Invalid token structure');
        return res.status(401).json({ message: "Invalid Token" });
      }

      // Set user data from token
      req.user = {
        id: verified.id,
        role: verified.role || 'member' // Default to member if role not present
      };
      console.log('Auth middleware - User set:', req.user);

      next();
    } catch (verifyError) {
      console.error('Auth middleware - Token verification error:', verifyError);
      return res.status(401).json({ message: "Invalid Token" });
    }
  } catch (err) {
    console.error('Auth middleware - General error:', err);
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = auth; 