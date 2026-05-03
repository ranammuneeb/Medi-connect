const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  location: { type: String, default: 'Not specified' },
  rating: { type: Number, default: 4.5 },
  experience: { type: Number, default: 0 },
  education: { type: String },
  licenseNumber: { type: String },
  phone: { type: String },
  email: { type: String, required: true },
  bio: { type: String },
  consultationFee: { type: Number, default: 100 },
  avatar: { type: String },
  availability: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);