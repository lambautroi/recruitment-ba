const express = require("express");
const User = require("../models/userModel");
const Job = require("../models/jobModel");
const Category = require("../models/categoryModel");
const Employer = require("../models/employerModel");
const Location = require("../models/locationModel");
const router = express.Router();

// Lấy tổng số người dùng (ứng viên)
router.get("/total-users", async (req, res) => {
    try {
        const userCount = await User.countDocuments({ role: "user" });
        res.json({ userCount });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy số lượng người dùng" });
    }
});

// Lấy tổng số doanh nghiệp
router.get("/total-employers", async (req, res) => {
    try {
        const employerCount = await User.countDocuments({ role: "employer" });
        res.json({ employerCount });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy số lượng doanh nghiệp" });
    }
});

// Lấy tổng số tin tuyển dụng
router.get("/total-jobs", async (req, res) => {
    try {
        const jobCount = await Job.countDocuments();
        res.json({ jobCount });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy số lượng tin tuyển dụng",
        });
    }
});

// Lấy tổng số danh mục nghề nghiệp
router.get("/total-categories", async (req, res) => {
    try {
        const categoryCount = await Category.countDocuments();
        res.json({ categoryCount });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy số lượng danh mục nghề nghiệp",
        });
    }
});

// Lấy thống kê tổng quan
router.get("/stats", async (req, res) => {
    try {
        const jobCount = await Job.countDocuments({ status: "active" });
        const employerCount = await User.countDocuments({ role: "employer" });
        const userCount = await User.countDocuments({ role: "user" });
        const categoryCount = await Category.countDocuments();

        res.json({
            jobCount,
            employerCount,
            userCount,
            categoryCount,
        });
    } catch (error) {
        console.error("Lỗi khi lấy thống kê", error);
        res.status(500).json({ message: "Lỗi khi lấy thống kê" });
    }
});

// Lấy danh sách công ty nổi bật, sắp xếp theo thời gian (hoặc số lượng tin tuyển dụng)
router.get("/employers", async (req, res) => {
    try {
        const employers = await Employer.find().populate(
            "location_id",
            "location_name"
        );

        const employersWithJobCount = await Promise.all(
            employers.map(async (employer) => {
                const jobCount = await Job.countDocuments({
                    employer_id: employer._id,
                });
                return {
                    employerName: employer.employer_name,
                    employerLogo: employer.employer_logo,
                    employerLocation: employer.location_id.location_name,
                    jobCount,
                    createdAt: employer.createdAt,
                };
            })
        );

        const sortedEmployers = employersWithJobCount
            .sort((a, b) => b.jobCount - a.jobCount)
            .sort((a, b) => b.createdAt - a.createdAt);

        res.json(sortedEmployers);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách công ty", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách công ty" });
    }
});

// Lấy dữ liệu thống kê người dùng (ứng viên) theo tháng
router.get("/users-by-month", async (req, res) => {
    try {
        const userStats = await User.aggregate([
            { $match: { role: "user" } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        res.json(userStats);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy thống kê người dùng theo tháng",
        });
    }
});

// Lấy dữ liệu thống kê doanh nghiệp (employer) theo tháng
router.get("/employer-by-month", async (req, res) => {
    try {
        const employerStats = await User.aggregate([
            { $match: { role: "employer" } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        res.json(employerStats);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy thống kê doanh nghiệp theo tháng",
        });
    }
});

// Lấy dữ liệu thống kê tin tuyển dụng theo tháng
router.get("/jobs-by-month", async (req, res) => {
    try {
        const jobStats = await Job.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        res.json(jobStats);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy thống kê tin tuyển dụng theo tháng",
        });
    }
});

module.exports = router;
