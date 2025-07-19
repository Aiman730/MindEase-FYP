const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  childName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['new', 'family'], required: true },
  familyCode: { type: String },
  generatedCode: { type: String },
  notifications: { type: [String], default: [] },
});

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);