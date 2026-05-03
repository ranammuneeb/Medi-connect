const Doctor = require('../models/Doctor');

const getDoctors = async (req, res) => {
  try {
    const { search, specialty, location } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (specialty) query.specialty = specialty;
    if (location) query.location = location;

    const doctors = await Doctor.find(query).sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && String(req.user.doctorId) !== String(req.params.id)) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (doctor) {
      res.json({ message: 'Doctor removed' });
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const User = require('../models/User');

const createDoctor = async (req, res) => {
  try {
    const { name, email, specialty, location, experience, consultationFee, phone, education, bio, avatar } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Doctor email already exists' });
    }

    // Create doctor profile
    const doctor = await Doctor.create({
      name,
      email,
      specialty,
      location,
      experience: Number(experience) || 0,
      consultationFee: Number(consultationFee) || 100,
      phone,
      education,
      bio,
      avatar,
      rating: 4.5,
      availability: {},
    });

    // Create user account for the doctor
    await User.create({
      name,
      email,
      password: 'doctor123', // Default password
      role: 'doctor',
      phone,
      avatar,
      doctorId: doctor._id,
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getDoctorById, updateDoctor, deleteDoctor, createDoctor };