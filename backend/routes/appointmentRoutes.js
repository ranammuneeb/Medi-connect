const express = require('express');
const router = express.Router();
const { getAppointments, bookAppointment, updateAppointmentStatus, getBookedSlots } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAppointments);
router.post('/', protect, bookAppointment);
router.patch('/:id/status', protect, updateAppointmentStatus);
router.get('/slots/:doctorId/:date', protect, getBookedSlots);

module.exports = router;