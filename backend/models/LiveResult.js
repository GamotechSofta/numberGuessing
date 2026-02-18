const mongoose = require('mongoose');

const liveResultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  result: {
    type: String,
    default: 'Loading...',
    trim: true
  },
  timeRange: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LiveResult', liveResultSchema);
