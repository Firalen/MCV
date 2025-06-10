const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    console.log('Admin middleware - User from auth:', req.user);
    
    if (!req.user || !req.user.id) {
      console.log('Admin middleware - No user or user ID in request');
      return res.status(401).json({ message: "Authentication required" });
    }

    // First check the role from the token
    if (req.user.role === 'admin') {
      console.log('Admin middleware - User is admin based on token');
      return next();
    }

    // If not admin in token, check the database
    const user = await User.findById(req.user.id);
    console.log('Admin middleware - Found user:', user ? { id: user._id, role: user.role } : 'Not found');

    if (!user) {
      console.log('Admin middleware - User not found in database');
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== 'admin') {
      console.log('Admin middleware - User is not an admin:', user.role);
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // Update the user object with the database role
    req.user.role = user.role;
    console.log('Admin middleware - Access granted for admin user');
    next();
  } catch (err) {
    console.error('Admin middleware - Error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = admin; 