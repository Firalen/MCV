const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  positions: [{
    type: String,
    enum: [
      'Outside Hitter',
      'Middle Blocker',
      'Opposite Hitter',
      'Setter',
      'Libero',
      'Defensive Specialist'
    ]
  }],
  number: { 
    type: Number, 
    required: true,
    min: 1,
    max: 99
  },
  age: { 
    type: Number, 
    required: true,
    min: 16,
    max: 45
  },
  nationality: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  stats: {
    kills: { type: Number, default: 0 },
    aces: { type: Number, default: 0 },
    digs: { type: Number, default: 0 },
    blocks: { type: Number, default: 0 }
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema); 