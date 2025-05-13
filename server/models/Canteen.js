// server/models/Canteen.js
const mongoose = require('mongoose');

const canteenSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  employeeEmail: { // Added based on error
    type: String,
    required: true,
  },
  name: { // Added based on error
    type: String,
    required: true,
  },
  requestType: { type: String, required: true },
  orderDetails: { // Added based on error
    type: String,
    required: true,
  },
  details: { type: String },
  requestDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Processed', 'Declined'], default: 'Pending' },
  adminMessage: { type: String, default: '' },
});

module.exports = mongoose.model('Canteen', canteenSchema);