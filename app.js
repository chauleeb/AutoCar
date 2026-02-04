require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");


const userRoutes = require("./routes/users");
const ownerRoutes = require("./routes/owner");
const bookingRoutes = require("./routes/bookings");
const adminRoutes = require("./routes/admin");
const viewRoutes = require("./routes/views");
const carRoutes = require("./routes/cars");
const authRoutes = require("./routes/auth");


const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // đọc form EJS
app.set('views', __dirname + '/views'); // chỉ định thư mục view

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/owners", ownerRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/", viewRoutes);
app.use("/api/v1/cars", carRoutes);
app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
