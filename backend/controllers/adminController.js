const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

const getAdminStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();
    
    const paidAppointments = await Appointment.find({ paymentStatus: 'paid' });
    const totalRevenue = paidAppointments.reduce((sum, appt) => sum + appt.fee, 0);

    const confirmed = await Appointment.countDocuments({ status: 'confirmed' });
    const pending = await Appointment.countDocuments({ status: 'pending' });
    const completed = await Appointment.countDocuments({ status: 'completed' });
    const cancelled = await Appointment.countDocuments({ status: 'cancelled' });

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalRevenue,
      appointmentsByStatus: { confirmed, pending, completed, cancelled }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAppointmentsByDay = async (req, res) => {
  try {
    res.json([
      { day: 'Mon', count: 12 },
      { day: 'Tue', count: 19 },
      { day: 'Wed', count: 8 },
      { day: 'Thu', count: 15 },
      { day: 'Fri', count: 22 },
      { day: 'Sat', count: 6 },
      { day: 'Sun', count: 3 },
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRevenueByMonth = async (req, res) => {
  try {
    res.json([
      { month: 'Oct', revenue: 4200 },
      { month: 'Nov', revenue: 5800 },
      { month: 'Dec', revenue: 3900 },
      { month: 'Jan', revenue: 7100 },
      { month: 'Feb', revenue: 6400 },
      { month: 'Mar', revenue: 8200 },
      { month: 'Apr', revenue: 5600 },
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats, getAppointmentsByDay, getRevenueByMonth };