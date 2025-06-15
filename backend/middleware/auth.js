const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!verified || !verified.userId) {
        return res.status(401).json({ message: 'Invalid token structure' });
      }

      // Set user data from token
      req.user = {
        id: verified.userId,
        role: verified.role || 'member' // Default to member if role not present
      };

      next();
    } catch (verifyError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = auth; 