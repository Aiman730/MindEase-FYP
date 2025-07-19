const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); 
require('dotenv').config();

// Function to generate a unique family code
const generateFamilyCode = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let exists;

  do {
    code = 'FAM-' + Array.from({ length: 5 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
    exists = await User.findOne({ familyCode: code });
  } while (exists);

  return code;
};

// POST request to handle user registration
router.post('/register', async (req, res) => {
    const { fullName, childName, email, userid, password, role, enteredCode } = req.body;
    let familyCode;
  
    try {
      const existingUserWithChild = await User.findOne({ childName });
  
      if (role === 'new') {
        if (existingUserWithChild) {
          return res.status(400).json({ error: 'A family already exists for this child. Please join the existing family.' });
        }
  
        // Generate new family code
        familyCode = await generateFamilyCode();
  
      } else if (role === 'family') {
        if (!enteredCode) {
          return res.status(400).json({ error: 'Family code is required for joining a family.' });
        }
  
        const validFamily = await User.findOne({ familyCode: enteredCode, childName });
  
        if (!validFamily) {
          return res.status(400).json({ error: 'Invalid family code or does not match the child name.' });
        }
  
        familyCode = enteredCode;
  
      } else {
        return res.status(400).json({ error: 'Invalid role.' });
      }
  
      // Check if username or email already exists
      const existingEmail = await User.findOne({ email });
      const existingUser = await User.findOne({ userid });
  
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already in use.' });
      }
      if (existingUser) {
        return res.status(400).json({ error: 'UserId already in use.' });
      }
  
      const newUser = new User({
        fullName,
        childName,
        email,
        userid,
        password,
        role,
        familyCode,
      });
  
      const savedUser = await newUser.save();
  
      if (role === 'family') {
        await User.updateMany(
          { familyCode },
          { $push: { notifications: `${userid} joined your family group!` } }
        );
      }
  
      res.json({
        message: 'User registered',
        ...(role === 'new' && { familyCode }), // return new family code only for new users
      });
    } catch (error) {
      console.error('Registration error:', error.message);
      res.status(500).json({ error: error.message || 'Registration failed' });
    }
  });


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'Email not found' });

    // Generate a simple reset link (in real apps, use token with expiry)
    const resetLink = `http://localhost:3000/reset-password/${user._id}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    await transporter.sendMail({
      from: `Your App <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click to reset password: <a href="${resetLink}">${resetLink}</a></p>`,
    });
    

    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

  
  

  router.post('/login', async (req, res) => {
    console.log('Request body:', req.body);
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Compare entered password with stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Create a JWT token
      const token = jwt.sign({ userId: user._id.toString() }, 'yourSecretKey', { expiresIn: '1d' });
  
      // Send the token in the response
      res.json({
        message: 'Login successful',
        token,  
        fullName: user.fullName,
        childName: user.childName,
        userid: user.userid,
        email: user.email,
      });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ message: error.message || 'Login failed' });
    }
  });
  
  module.exports = router;