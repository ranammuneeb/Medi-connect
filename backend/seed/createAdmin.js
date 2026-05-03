/**
 * Run once to create the admin user in MongoDB.
 * Usage: node seed/createAdmin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');

  const existing = await User.findOne({ email: 'admin@mediconnect.com' });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'System Admin',
    email: 'admin@mediconnect.com',
    password: hashedPassword,
    role: 'admin',
  });

  console.log('✅ Admin created successfully!');
  console.log('   Email:    admin@mediconnect.com');
  console.log('   Password: admin123');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
