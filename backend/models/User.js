const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  role: { 
    type: String, 
    enum: ['member', 'admin'],
    default: 'member'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: { 
    type: Date 
  }
});

module.exports = mongoose.model('User', userSchema); 