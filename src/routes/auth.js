const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
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

// Route lấy danh sách người dùng
router.get("/users", async (req, res) => {
    try {
        const users = await User.find(); // Lấy tất cả người dùng từ MongoDB
        res.json(users); // Trả về danh sách người dùng dưới dạng JSON
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu người dùng" });
    }
});

// Xóa người dùng
router.delete("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res
                .status(404)
                .json({ message: "Người dùng không tồn tại!" });
        }

        await User.findByIdAndDelete(id); // Xóa người dùng
        res.status(200).json({ message: "Người dùng đã được xóa!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa người dùng" });
    }
});

// Cập nhật thông tin người dùng
router.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { fullName, email, phone, role } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res
                .status(404)
                .json({ message: "Người dùng không tồn tại!" });
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.role = role || user.role;

        await user.save();

        res.status(200).json({
            message: "Thông tin người dùng đã được cập nhật!",
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật người dùng" });
    }
});

module.exports = router;
