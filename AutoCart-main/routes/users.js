const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Bài 2: Lịch sử thuê xe
router.get('/me', verifyToken, userController.getMyProfile);
router.get('/me/bookings', verifyToken, userController.getMyBookings);
router.get('/:id', verifyToken, userController.getUserById);
router.get('/:id/bookings', verifyToken, userController.getUserBookings);


module.exports = router;