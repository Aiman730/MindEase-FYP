const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Playlist= require('../models/Playlist');

// Edit Account

router.post('/update-account', async (req, res) => {
  const { fullName, childName, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    user.fullName = fullName;
    user.childName = childName;

    await user.save();

    res.json({ success: true, message: 'Account updated successfully' });
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});



// Change Password

router.post('/change-password', async (req, res) => {
  const { userid, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ userid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Account

router.post('/delete-account', async (req, res) => {
  try {
      const { userid, email } = req.body;

      // Validate input
      if (!userid || !email) {
          return res.status(400).json({ success: false, message: 'User ID and email are required' });
      }

      // Find user by ID and verify email matches
      const user = await User.findOne({ userid, email });

      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found or email mismatch' });
      }

      // Delete user's playlists
      await Playlist.deleteMany({ userId: userid });

      // Delete user account
      await User.deleteOne({ email });

      res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ success: false, message: 'Failed to delete account', error: error.message });
  }
});


module.exports = router;