const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const getAppointments = async (req, res) => {
  try {
    const { patientId, doctorId, status } = req.query;
    let query = {};
    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;
    if (status) query.status = status;

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { patientId, patientName, patientEmail, patientPhone, doctorId, doctorName, specialty, date, time, symptoms, fee } = req.body;
    

    const doctor = await Doctor.findById(doctorId);
    const doctorAvatar = doctor ? doctor.avatar : '';

    const appointment = await Appointment.create({
      patientId, patientName, patientEmail, patientPhone, doctorId, doctorName, doctorAvatar, specialty, date, time, symptoms, fee
    });
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userRole = req.user.role;


    if (userRole === 'patient' && status !== 'cancelled') {
      return res.status(403).json({ message: 'Patients can only cancel appointments' });
    }


    const doctorAllowedStatuses = ['in-progress', 'completed', 'cancelled'];
    if (userRole === 'doctor' && !doctorAllowedStatuses.includes(status)) {
      return res.status(403).json({ message: 'Doctors can only set status to in-progress, completed, or cancelled' });
    }


    const adminAllowedStatuses = ['confirmed', 'cancelled', 'pending'];
    if (userRole === 'admin' && !adminAllowedStatuses.includes(status)) {
      return res.status(403).json({ message: 'Admins can only set status to confirmed, cancelled, or pending' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookedSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const appointments = await Appointment.find({ doctorId, date, status: { $ne: 'cancelled' } });
    const slots = appointments.map(appt => appt.time);
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAppointments, bookAppointment, updateAppointmentStatus, getBookedSlots };