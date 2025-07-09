const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
    const { fullName, email, phone, password, confirmPassword, role } =
        req.body;

    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có trùng khớp không
    if (password !== confirmPassword) {
        return res
            .status(400)
            .json({ message: "Mật khẩu xác nhận không khớp!" });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Tạo tài khoản người dùng mới
        const user = new User({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role, // Role được chọn khi đăng ký
        });

        await user.save();
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống, vui lòng thử lại!" });
    }
});

// Đăng nhập
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Sai thông tin đăng nhập!" });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    res.json({ token });
});

module.exports = router;
