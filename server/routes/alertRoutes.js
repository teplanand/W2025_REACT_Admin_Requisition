// server/routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  const { message, sentTo } = req.body;
  if (!message || !sentTo) return res.status(400).json({ msg: 'Message and sentTo are required' });
  try {
    const alert = new Alert({ message, sentBy: req.user.email, sentTo });
    await alert.save();
    res.json({ msg: 'Alert sent successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.get('/employee', auth, async (req, res) => {
  if (req.user.role !== 'employee') return res.status(403).json({ msg: 'Access denied' });
  try {
    const alerts = await Alert.find({ sentTo: 'all' });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;