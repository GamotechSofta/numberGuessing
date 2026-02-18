const mongoose = require('mongoose');

const chartDataSchema = new mongoose.Schema({
  dateRange: {
    type: String,
    required: true,
    trim: true
  },
  mon: {
    type: String,
    default: '',
    trim: true
  },
  tue: {
    type: String,
    default: '',
    trim: true
  },
  wed: {
    type: String,
    default: '',
    trim: true
  },
  thu: {
    type: String,
    default: '',
    trim: true
  },
  fri: {
    type: String,
    default: '',
    trim: true
  },
  sat: {
    type: String,
    default: '',
    trim: true
  },
  sun: {
    type: String,
    default: '',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChartData', chartDataSchema);
