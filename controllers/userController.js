const Booking = require('../models/Booking');
const User = require('../models/User');
const Car = require('../models/Car');

// GET /users/:id/bookings - Lịch sử thuê xe của user
exports.getUserBookings = async (req, res) => {
  try {

    const requestedUserId = req.params.id;
    const loggedInUserId = req.userId; // Từ token (được gắn bởi verifyToken middleware)

    //  Kiểm tra: User chỉ được xem booking của chính họ
    if (requestedUserId !== loggedInUserId.toString()) {
      return res.status(403).json({
        error: {
          message: 'You can only view your own bookings',
          code: 'FORBIDDEN'
        }
      });
    }
    const bookings = await Booking.find({ userId: req.params.id })
      .populate('carId', 'brand model licensePlate pricePerDay')
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước

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
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.userId; // Lấy từ token

    const bookings = await Booking.find({ userId })
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
// GET /users/:id - Xem thông tin user chi tiết
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Tìm user và loại bỏ password
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Lấy thống kê bookings của user (optional)
    const bookingsCount = await Booking.countDocuments({ userId });
    const totalSpent = await Booking.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        statistics: {
          totalBookings: bookingsCount,
          totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0
        }
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

// GET /users/me - Xem thông tin user hiện tại (từ token)
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.userId; // Từ token

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Lấy thống kê
    const bookingsCount = await Booking.countDocuments({ userId });
    const totalSpent = await Booking.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        statistics: {
          totalBookings: bookingsCount,
          totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0
        }
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