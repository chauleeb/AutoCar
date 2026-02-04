const Booking = require('../models/Booking');
const User = require('../models/User');
const Car = require('../models/Car');
// GET /bookings/:id - Xem chi tiết booking với user và car info
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone') // Populate user info
      .populate('carId', 'brand model licensePlate pricePerDay'); // Populate car info

    if (!booking) {
      return res.status(404).json({
        error: {
          message: 'Booking not found',
          code: 'BOOKING_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: booking
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


// POST /bookings - Tạo booking mới
exports.createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;
    const userId = req.userId;

    // 1. Validate dữ liệu
    if (!userId || !carId || !startDate || !endDate) {
      return res.status(400).json({
        error: {
          message: 'Missing booking data',
          code: 'INVALID_DATA'
        }
      });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        error: {
          message: 'End date must be after start date',
          code: 'INVALID_DATE'
        }
      });
    }

    // 2. Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // 3. Kiểm tra car tồn tại
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        error: {
          message: 'Car not found',
          code: 'CAR_NOT_FOUND'
        }
      });
    }

    // 4. Kiểm tra trùng lịch thuê
    const existingBookings = await Booking.find({ carId });

    for (let booking of existingBookings) {
      const isOverlap =
        new Date(startDate) < booking.endDate &&
        new Date(endDate) > booking.startDate;

      if (isOverlap) {
        return res.status(409).json({
          error: {
            message: 'Booking time overlaps',
            code: 'BOOKING_CONFLICT'
          }
        });
      }
    }

    // 5. Tính tiền thuê xe
    const start = new Date(startDate);
    const end = new Date(endDate);

    const days = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = days * car.pricePerDay;

    // 6. Tạo booking
    const newBooking = await Booking.create({
      userId,
      carId,
      startDate,
      endDate,
      totalPrice,
      status: 'CONFIRMED'
    });

    res.status(201).json({
      success: true,
      data: newBooking
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
