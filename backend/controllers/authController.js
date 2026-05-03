const User = require('../models/User');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email, role });
    if (user && (await user.matchPassword(password))) {
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      };
      if (user.role === 'doctor') {
        userData.doctorId = user.doctorId;
      }
      res.json(userData);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const { name, email, password, role, ...otherDetails } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let doctorId = null;
    const avatar = ''; // Avatar will be uploaded by the user themselves

    if (role === 'doctor') {
      const doctor = await Doctor.create({
        name,
        email,
        specialty: otherDetails.specialization || otherDetails.specialty || 'General Physician',
        phone: otherDetails.phone,
        licenseNumber: otherDetails.licenseNumber,
        experience: otherDetails.experience,
        avatar,
        consultationFee: otherDetails.consultationFee || 100,
      });
      doctorId = doctor._id;
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar,
      doctorId,
      phone: otherDetails.phone,
      gender: otherDetails.gender,
      dob: otherDetails.dob,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        doctorId: user.doctorId,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crypto = require('crypto');

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

    await user.save();

    // In a real app, send email here. For now, we return it in response for dev testing.
    res.json({ 
      message: 'Password reset token generated', 
      resetToken, // RETURNED FOR DEV TESTING
      instruction: 'In a production app, this would be sent to your email.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login, register, forgotPassword, resetPassword };