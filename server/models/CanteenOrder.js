const mongoose = require('mongoose');

const canteenOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  name: { type: String, required: true },
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  adminMessage: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }, // Ensure this is set
});

module.exports = mongoose.model('CanteenOrder', canteenOrderSchema);