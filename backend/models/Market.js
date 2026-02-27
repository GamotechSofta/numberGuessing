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
  // Market type: regular (main/daily), starline, king (kingbazaar)
  marketType: {
    type: String,
    enum: ['regular', 'starline', 'king'],
    default: 'regular'
  },
  openingTime: { type: String, trim: true, default: '' },
  closingTime: { type: String, trim: true, default: '' },
  goldenAnk: { type: String, trim: true, default: '' },
  motorPatti: { type: String, trim: true, default: '' },
  // Flag to mark market for Top Markets Guessing section
  isTopMarket: { type: Boolean, default: false },
  // Guessing values for Top Markets section (stored as comma-separated strings)
  guessingSingle: { type: String, trim: true, default: '' },
  guessingJodi: { type: String, trim: true, default: '' },
  guessingPana: { type: String, trim: true, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Market', marketSchema);
