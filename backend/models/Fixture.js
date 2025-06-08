const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
  opponent: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true,
    enum: ['Home', 'Away']
  },
  status: {
    type: String,
    required: true,
    enum: ['Upcoming', 'Live', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  score: {
    home: {
      type: Number,
      default: 0
    },
    away: {
      type: Number,
      default: 0
    }
  },
  competition: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Fixture', fixtureSchema); 