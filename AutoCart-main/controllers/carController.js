const Car = require('../models/Car');

// GET /cars - Lấy tất cả xe
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cars.length,
      data: cars
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

// GET /cars/:id - Chi tiết xe
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('ownerId', 'name email');

    if (!car) {
      return res.status(404).json({
        error: {
          message: 'Car not found',
          code: 'CAR_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: car
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