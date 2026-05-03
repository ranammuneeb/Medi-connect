const express = require('express');
const router = express.Router();
const { processPayment, confirmPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/process', protect, processPayment);
router.post('/confirm', protect, confirmPayment);

module.exports = router;