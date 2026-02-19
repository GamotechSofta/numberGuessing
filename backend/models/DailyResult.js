const mongoose = require('mongoose');

const dailyResultSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  marketName: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  open: {
    type: String,
    required: true,
    trim: true
  },
  close: {
    type: String,
    required: true,
    trim: true
  },
  result: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true
});

// Create compound index to ensure unique combination of date and marketName
dailyResultSchema.index({ date: 1, marketName: 1 }, { unique: true });

module.exports = mongoose.model('DailyResult', dailyResultSchema);
