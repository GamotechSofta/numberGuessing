const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  name: {
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
  openingTime: { type: String, trim: true, default: '' },
  closingTime: { type: String, trim: true, default: '' },
  goldenAnk: { type: String, trim: true, default: '' },
  motorPatti: { type: String, trim: true, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Market', marketSchema);
