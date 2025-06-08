const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true,
    enum: ['Outside Hitter', 'Middle Blocker', 'Opposite Hitter', 'Setter', 'Libero']
  },
  number: {
    type: Number,
    required: true,
    unique: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Injured', 'Suspended', 'Inactive'],
    default: 'Active'
  },
  stats: {
    kills: {
      type: Number,
      default: 0
    },
    aces: {
      type: Number,
      default: 0
    },
    digs: {
      type: Number,
      default: 0
    },
    blocks: {
      type: Number,
      default: 0
    }
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Player', playerSchema); 