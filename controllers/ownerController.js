const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User'); 

// GET /owner/bookings - Owner xem booking của xe mình
exports.getOwnerBookings = async (req, res) => {
  try {
    // Giả sử ownerId được lấy từ middleware auth (req.user.id)
    // Ở đây dùng query param để demo
    const ownerId = req.query.ownerId || req.user?.id;

    if (!ownerId) {
      return res.status(400).json({
        error: {
          message: 'Owner ID is required',
          code: 'MISSING_OWNER_ID'
        }
      });
    }

    // Tìm tất cả xe của owner này
    const ownerCars = await Car.find({ ownerId });
    const carIds = ownerCars.map(car => car._id);

    // Tìm tất cả booking liên quan đến các xe này
    const bookings = await Booking.find({ carId: { $in: carIds } })
      .populate('userId', 'name email phone')
      .populate('carId', 'brand model licensePlate pricePerDay')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        code: 'SERVER_ERROR'
      }
    });
  }
};