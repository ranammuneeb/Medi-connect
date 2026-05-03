
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');


  await User.deleteOne({ email: 'admin@mediconnect.com' });


  await User.create({
    name: 'System Admin',
    email: 'admin@mediconnect.com',
    password: 'admin123',
    role: 'admin',
  });

  console.log('✅ Admin created successfully!');
  console.log('   Email:    admin@mediconnect.com');
  console.log('   Password: admin123');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
