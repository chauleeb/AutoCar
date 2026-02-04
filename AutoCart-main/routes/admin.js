const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Bài 4: Thống kê booking
router.get('/bookings/summary', adminController.getBookingSummary);

module.exports = router;