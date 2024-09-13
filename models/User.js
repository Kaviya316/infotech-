const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  slot: String,
  purpose: String,
  date: String,
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  appointments: [appointmentSchema],
  records: { type: Map, of: String }, // Patient data
  emergencyContacts: [{ type: String }], // Relatives to notify
});

module.exports = mongoose.model('User', userSchema);

