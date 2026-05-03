/**
 * Clears all dummy/test data from MongoDB while preserving the admin user.
 * Run once: node seed/clearDummyData.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

async function clear() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');

  // Delete all doctors
  const doctors = await Doctor.deleteMany({});
  console.log(`✅ Deleted ${doctors.deletedCount} doctor(s)`);

  // Delete all users except admin
  const users = await User.deleteMany({ role: { $ne: 'admin' } });
  console.log(`✅ Deleted ${users.deletedCount} patient/doctor user(s) (admin preserved)`);

  // Delete all appointments
  const appointments = await Appointment.deleteMany({});
  console.log(`✅ Deleted ${appointments.deletedCount} appointment(s)`);

  console.log('\n🎉 Database cleared. Admin account preserved.');
  console.log('   Admin: admin@mediconnect.com / admin123');
  process.exit(0);
}

clear().catch((err) => { console.error(err); process.exit(1); });
