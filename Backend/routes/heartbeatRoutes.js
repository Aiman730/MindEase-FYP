const express = require('express');
const router = express.Router();
const Heartbeat = require('../models/Heartbeat');

// Save Heartbeat
router.post('/add', async (req, res) => {
  try {
    const { childName, familyCode, heartbeat } = req.body;
    const newBeat = new Heartbeat({ childName, familyCode, heartbeat });
    await newBeat.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get latest Heartbeat for a child
router.get('/:childName/:familyCode', async (req, res) => {
  try {
    const { childName, familyCode } = req.params;
    const latest = await Heartbeat.findOne({ childName, familyCode }).sort({ timestamp: -1 });
    res.json(latest || { heartbeat: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
