

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const transporter = require('../server').transporter;  // Reuse Nodemailer transporter
module.exports = router;

// User Registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ msg: 'User registered' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).send('Invalid credentials');
    res.json({ msg: 'Login successful', userId: user._id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Book Appointment
router.post('/appointment', async (req, res) => {
  const { userId, slot, purpose, date } = req.body;
  try {
    const user = await User.findById(userId);
    user.appointments.push({ slot, purpose, date });
    await user.save();
    // Send email confirmation
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Appointment Confirmation',
      text: `Your appointment for ${purpose} on ${date} is confirmed.`,
    });
    res.json({ msg: 'Appointment booked' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Emergency Alert
router.post('/emergency', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    user.emergencyContacts.forEach(contact => {
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: contact,
        subject: 'Emergency Alert',
        text: `Emergency alert triggered for ${user.email}.`,
      });
    });
    res.json({ msg: 'Emergency alerts sent' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

