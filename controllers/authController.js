const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

// REGISTER
exports.register = async (req, res) => {
    try {
        // ✅ Lấy đủ các field cần thiết
        const { name, email, password, phone } = req.body;

        // Validate input cơ bản
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check user tồn tại chưa
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // ✅ Tạo user với đầy đủ fields
        const newUser = new User({
            name,      // ✅ Thêm name
            email,     // ✅ Đúng field
            password,
            phone      // ✅ Thêm phone

        });

        await newUser.save();

        res.json({
            message: "Register successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; 

        const user = await User.findOne({ email }); 

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Tạo token
        const token = jwt.sign(
            { 
                userId: user._id,
                role: user.role // Thêm role vào token để dễ kiểm tra
            },
            SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};