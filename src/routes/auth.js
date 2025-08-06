const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Candidate = require("../models/candidateModel");
const Employer = require("../models/employerModel");
const mongoose = require("mongoose"); // ✅ THÊM: Import mongoose
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

    try {
        // Kiểm tra email đã tồn tại chưa trong User
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại!" });
        }

        // ✅ THÊM: Kiểm tra email đã tồn tại trong Candidate hoặc Employer
        if (role === "user") {
            const existingCandidate = await Candidate.findOne({ email });
            if (existingCandidate) {
                return res
                    .status(400)
                    .json({ message: "Email đã được đăng ký làm ứng viên!" });
            }
        } else if (role === "employer") {
            const existingEmployer = await Employer.findOne({ email });
            if (existingEmployer) {
                return res
                    .status(400)
                    .json({
                        message: "Email đã được đăng ký làm nhà tuyển dụng!",
                    });
            }
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ SỬA: Khởi tạo session đúng cách
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Tạo User
            const user = new User({
                fullName,
                email,
                phone,
                password: hashedPassword,
                role,
            });

            await user.save({ session });

            // ✅ THÊM: Tạo Candidate hoặc Employer tương ứng
            if (role === "user") {
                // Tạo Candidate record
                const candidate = new Candidate({
                    full_name: fullName,
                    email: email,
                    phone: phone,
                    status: "active",
                });

                await candidate.save({ session });
            } else if (role === "employer") {
                // Tạo Employer record
                const employer = new Employer({
                    employer_name: fullName,
                    email: email,
                    phone: phone,
                });

                await employer.save({ session });
            }

            // Commit transaction
            await session.commitTransaction();
            session.endSession();

            res.status(201).json({
                message: "Đăng ký thành công!",
                role: role,
                redirect:
                    role === "user"
                        ? "/candidate/dashboard"
                        : "/employer/dashboard",
            });
        } catch (error) {
            // Rollback transaction nếu có lỗi
            await session.abortTransaction();
            session.endSession();

            console.error("Transaction error:", error);
            throw error; // Re-throw để catch block bên ngoài xử lý
        }
    } catch (error) {
        console.error("Registration error:", error);

        // ✅ SỬA: Handle specific error types
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(400).json({
                message: "Email đã được sử dụng!",
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Dữ liệu không hợp lệ",
                error: error.message,
            });
        }

        res.status(500).json({
            message: "Lỗi hệ thống, vui lòng thử lại!",
            error: error.message,
        });
    }
});

// ✅ GIỮ NGUYÊN: Các routes khác...
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res
                .status(401)
                .json({ message: "Sai thông tin đăng nhập!" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email,
            },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
            redirect:
                user.role === "user"
                    ? "/candidate/dashboard"
                    : user.role === "employer"
                    ? "/employer/dashboard"
                    : "/admin-dashboard",
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Lỗi hệ thống, vui lòng thử lại!" });
    }
});

// Route lấy danh sách người dùng
router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu người dùng" });
    }
});

module.exports = router;
