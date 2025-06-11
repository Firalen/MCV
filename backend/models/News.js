const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  category: {
    type: String,
    enum: ['Match Report', 'Team News', 'Club Update', 'Event', 'Other'],
    default: 'Other'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('News', newsSchema); 