const express = require('express');
const router = express.Router();

const Car = require('../models/Car');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Trang chủ - Hiển thị danh sách xe
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.render('home', { cars });  // ✅ Truyền biến cars vào view
  } catch (error) {
    res.status(500).send('Error loading home page: ' + error.message);
  }
});
// Trang Login
router.get('/login', (req, res) => {
  res.render('login');
});

// Trang Register
router.get('/register', (req, res) => {
  res.render('register');
});
// Trang danh sách xe
router.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.render('cars', { cars });
  } catch (error) {
    res.status(500).send('Error loading cars: ' + error.message);
  }
});

// Trang booking xe
router.get('/booking/:carId', async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    res.render('booking', { carId: req.params.carId, car });
  } catch (error) {
    res.status(500).send('Error loading booking page: ' + error.message);
  }
});

// Trang tất cả bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('carId', 'brand model licensePlate pricePerDay')
      .sort({ createdAt: -1 });
    res.render('bookings', { bookings });
  } catch (error) {
    res.status(500).send('Error loading bookings: ' + error.message);
  }
});

// Trang profile user (My bookings)
router.get('/profile', (req, res) => {
  // Client sẽ gọi API với token
  res.render('profile');
});

// Trang user detail (My Profile)
router.get('/user-detail', (req, res) => {
  res.render('user-detail');
});

// Trang users management
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('users', { users });
  } catch (error) {
    res.status(500).send('Error loading users: ' + error.message);
  }
});

// Trang admin dashboard
router.get('/admin-dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Tính tổng revenue
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    
    // Lấy bookings gần đây
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('carId', 'brand model')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.render('admin-dashboard', {
      stats: { totalUsers, totalCars, totalBookings, totalRevenue },
      recentBookings
    });
  } catch (error) {
    res.status(500).send('Error loading dashboard: ' + error.message);
  }
});

// Trang booking detail
router.get('/booking-detail', (req, res) => {
  res.render('booking-detail');
});


module.exports = router;
