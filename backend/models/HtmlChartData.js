const mongoose = require('mongoose');

const dayDataSchema = new mongoose.Schema({
  mainNumber: {
    type: String,
    default: '-'
  },
  isHighlighted: {
    type: Boolean,
    default: false
  },
  leftNumbers: {
    type: [String],
    default: []
  },
  rightNumbers: {
    type: [String],
    default: []
  },
  hasAsterisk: {
    type: Boolean,
    default: false
  },
  asteriskCount: {
    type: Number,
    default: 0
  }
}, { _id: false });

const htmlChartDataSchema = new mongoose.Schema({
  Date: {
    type: String,
    required: true,
    trim: true
  },
  Mon: {
    type: dayDataSchema,
    default: null
  },
  Tue: {
    type: dayDataSchema,
    default: null
  },
  Wed: {
    type: dayDataSchema,
    default: null
  },
  Thu: {
    type: dayDataSchema,
    default: null
  },
  Fri: {
    type: dayDataSchema,
    default: null
  },
  Sat: {
    type: dayDataSchema,
    default: null
  },
  Sun: {
    type: dayDataSchema,
    default: null
  },
  marketName: {
    type: String,
    default: 'Kalyan Market',
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for sorting
htmlChartDataSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model('HtmlChartData', htmlChartDataSchema);
