
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cron = require('node-cron');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/user');


const router = express.Router();
module.exports = router;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/users',userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(error =>{console.error('MangoDB connection error:',error.message);
console.error('error details:',error);
});

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.transporter = transporter;

// Use Routes
app.use('/api/user', userRoutes);

// Stripe Payment Route
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Schedule Daily Health Reminders (9 AM)
cron.schedule('0 9 * * *', async () => {
  const users = await User.find();
  users.forEach(user => {
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Daily Health Reminder',
      text: 'Remember to exercise and eat healthy!',
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

