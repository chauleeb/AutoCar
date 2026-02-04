const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');


// Bài 3: Bookings của owner
router.get('/bookings', ownerController.getOwnerBookings);

module.exports = router;