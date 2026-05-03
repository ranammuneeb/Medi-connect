const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, updateDoctor, deleteDoctor, createDoctor } = require('../controllers/doctorController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', protect, admin, createDoctor);
router.put('/:id', protect, updateDoctor);
router.delete('/:id', protect, admin, deleteDoctor);

module.exports = router;