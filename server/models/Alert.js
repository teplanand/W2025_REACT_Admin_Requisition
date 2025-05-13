const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sentBy: { type: String, required: true }, // Admin's email
  sentTo: { type: String, enum: ['all'], required: true },
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'read'], default: 'sent' },
});

module.exports = mongoose.model('Alert', alertSchema);