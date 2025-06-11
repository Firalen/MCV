const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true
  },
  played: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  position: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('League', leagueSchema); 