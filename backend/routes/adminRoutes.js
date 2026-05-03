const express = require('express');
const router = express.Router();
const { getAdminStats, getAppointmentsByDay, getRevenueByMonth } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/appointments-by-day', protect, admin, getAppointmentsByDay);
router.get('/revenue-by-month', protect, admin, getRevenueByMonth);

module.exports = router;