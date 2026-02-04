const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/authMiddleware');


// Bài 1: Chi tiết booking
router.get('/:id', bookingController.getBookingById);
router.post('/', verifyToken, bookingController.createBooking);

module.exports = router;