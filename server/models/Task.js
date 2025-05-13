const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  assignedTo: { type: String, required: true }, // Employee email
  status: { type: String, default: 'pending' },
  progress: { type: Number, default: 0 },
  notified: { type: Boolean, default: false }, // Track if employee has seen the task
});

module.exports = mongoose.model('Task', taskSchema);