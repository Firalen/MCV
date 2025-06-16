const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Update req.user with the latest user data
    req.user = {
      id: user._id,
      role: user.role
    };

    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = admin; 