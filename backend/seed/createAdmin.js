/**
 * Re-creates the admin user correctly.
 * The User model auto-hashes passwords in the pre-save hook,
 * so we must NOT pre-hash the password ourselves.
 * Run: node seed/createAdmin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');

  // Remove any existing admin to start fresh
  await User.deleteOne({ email: 'admin@mediconnect.com' });

  // Create admin — the pre-save hook in User.js will hash the password automatically
  await User.create({
    name: 'System Admin',
    email: 'admin@mediconnect.com',
    password: 'admin123',   // plain text — model hashes it
    role: 'admin',
  });

  console.log('✅ Admin created successfully!');
  console.log('   Email:    admin@mediconnect.com');
  console.log('   Password: admin123');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
