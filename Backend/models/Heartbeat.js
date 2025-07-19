const mongoose = require('mongoose');

const heartbeatSchema = new mongoose.Schema({
  childName: {
    type: String,
    required: true,
  },
  familyCode: {
    type: String,
    required: true,
  },
  heartbeat: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Heartbeat', heartbeatSchema);