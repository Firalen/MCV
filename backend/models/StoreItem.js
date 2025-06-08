const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['Jerseys', 'Accessories', 'Equipment']
  },
  sizes: [{
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StoreItem', storeItemSchema); 