const Booking = require('../models/Booking');
const User = require('../models/User');     
const Car = require('../models/Car'); 

// GET /admin/bookings/summary - Thống kê booking
exports.getBookingSummary = async (req, res) => {
  try {
    // Tổng số booking
    const totalBookings = await Booking.countDocuments();
     const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();

    // Thống kê theo status
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Lấy danh sách booking mới nhất (có populate)
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('carId', 'brand model licensePlate')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCars,
        totalBookings,
        bookingsByStatus,
        recentBookings
      }
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