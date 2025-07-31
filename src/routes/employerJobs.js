const express = require("express");
const router = express.Router();
const Job = require("../models/jobModel");
const Employer = require("../models/employerModel");
const Category = require("../models/categoryModel");
const Application = require("../models/applicationModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");

// GET /api/employer/jobs - Lấy danh sách tin tuyển dụng của employer
router.get("/", auth, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const employer = await Employer.findOne({
            email: req.user.email,
        });

        if (!employer) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy thông tin doanh nghiệp" });
        }

        const skip = (page - 1) * limit;

        // Lấy danh sách jobs với pagination
        const jobs = await Job.find({ employer_id: employer._id })
            .populate("category_id", "category_name")
            .populate("location_id", "location_name")
            .populate("position_id", "position_name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Đếm tổng số jobs
        const totalJobs = await Job.countDocuments({
            employer_id: employer._id,
        });

        // Lấy số lượng ứng viên cho mỗi job
        const jobsWithApplicants = await Promise.all(
            jobs.map(async (job) => {
                const applicantCount = await Application.countDocuments({
                    job_id: job._id,
                });

                return {
                    _id: job._id,
                    title: job.title,
                    category_name:
                        job.category_id?.category_name || "Chưa xác định",
                    location_name:
                        job.location_id?.location_name || "Chưa xác định",
                    position_name:
                        job.position_id?.position_name || "Chưa xác định",
                    salary_range: job.salary_range,
                    quantity: job.quantity,
                    posted_at: job.posted_at,
                    expiration_date: job.expiration_date,
                    status: job.status,
                    applicant_count: applicantCount,
                    featured: job.featured || false,
                    createdAt: job.createdAt,
                };
            })
        );

        const totalPages = Math.ceil(totalJobs / limit);

        res.json({
            jobs: jobsWithApplicants,
            currentPage: parseInt(page),
            totalPages,
            totalJobs,
            limit: parseInt(limit),
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách tin tuyển dụng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// PUT /api/employer/jobs/:id/status - Cập nhật trạng thái job
router.put("/:id/status", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // ✅ SỬA: Tìm employer theo email của user
        const employer = await Employer.findOne({
            email: req.user.email,
        });

        if (!employer) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy thông tin doanh nghiệp" });
        }

        const job = await Job.findOne({
            _id: id,
            employer_id: employer._id,
        });

        if (!job) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy tin tuyển dụng" });
        }

        job.status = status;
        await job.save();

        res.json({ message: "Cập nhật trạng thái thành công", job });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// DELETE /api/employer/jobs/:id - Xóa tin tuyển dụng
router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ SỬA: Tìm employer theo email của user
        const employer = await Employer.findOne({
            email: req.user.email,
        });

        if (!employer) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy thông tin doanh nghiệp" });
        }

        const job = await Job.findOne({
            _id: id,
            employer_id: employer._id,
        });

        if (!job) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy tin tuyển dụng" });
        }

        await Job.findByIdAndDelete(id);

        // Cập nhật số lượng job của employer
        await Employer.findByIdAndUpdate(employer._id, {
            $inc: { num_job: -1 },
        });

        res.json({ message: "Xóa tin tuyển dụng thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa tin tuyển dụng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// GET /api/employer/jobs/:id - Lấy chi tiết tin tuyển dụng để chỉnh sửa
router.get("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ SỬA: Tìm employer theo email của user
        const employer = await Employer.findOne({
            email: req.user.email,
        });

        if (!employer) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy thông tin doanh nghiệp" });
        }

        const job = await Job.findOne({
            _id: id,
            employer_id: employer._id,
        })
            .populate("category_id", "category_name")
            .populate("location_id", "location_name")
            .populate("position_id", "position_name")
            .populate("experience_id", "experience_level")
            .populate("education_id", "education_level")
            .populate("form_of_employment_id", "form_name");

        if (!job) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy tin tuyển dụng" });
        }

        res.json(job);
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết tin tuyển dụng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// PUT /api/employer/jobs/:id - Cập nhật tin tuyển dụng
router.put("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm employer theo email của user
        const employer = await Employer.findOne({
            email: req.user.email,
        });

        if (!employer) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy thông tin doanh nghiệp" });
        }

        // Kiểm tra job có thuộc về employer này không
        const job = await Job.findOne({
            _id: id,
            employer_id: employer._id,
        });

        if (!job) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy tin tuyển dụng" });
        }

        // Cập nhật job
        const updatedJob = await Job.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                category_id: req.body.category_id,
                location_id: req.body.location_id,
                position_id: req.body.position_id,
                experience_id: req.body.experience_id,
                education_id: req.body.education_id,
                form_of_employment_id: req.body.form_of_employment_id,
                salary_range: req.body.salary_range,
                quantity: req.body.quantity,
                job_description: req.body.job_description,
                expiration_date: req.body.expiration_date,
                status: req.body.status,
            },
            { new: true, runValidators: true }
        );

        res.json({
            message: "Cập nhật tin tuyển dụng thành công",
            job: updatedJob,
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật tin tuyển dụng:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// POST /api/employer/jobs - Tạo tin tuyển dụng mới
router.post("/", auth, async (req, res) => {
    try {
        // Tìm employer theo email của user
        const employer = await Employer.findOne({
            email: req.user.email,
        });

        if (!employer) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy thông tin doanh nghiệp" });
        }

        // Tạo job mới
        const newJob = new Job({
            title: req.body.title,
            employer_id: employer._id,
            category_id: req.body.category_id,
            location_id: req.body.location_id,
            position_id: req.body.position_id,
            experience_id: req.body.experience_id,
            education_id: req.body.education_id,
            form_of_employment_id: req.body.form_of_employment_id,
            salary_range: req.body.salary_range,
            quantity: req.body.quantity,
            job_description: req.body.job_description,
            expiration_date: req.body.expiration_date,
            status: req.body.status || "active",
            posted_at: new Date(),
        });

        const savedJob = await newJob.save();

        // Cập nhật số lượng job của employer
        await Employer.findByIdAndUpdate(employer._id, {
            $inc: { num_job: 1 },
        });

        res.status(201).json({
            message: "Tạo tin tuyển dụng thành công",
            job: savedJob,
        });
    } catch (error) {
        console.error("Lỗi khi tạo tin tuyển dụng:", error);

        // Xử lý validation errors
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({
                message: "Dữ liệu không hợp lệ",
                errors: errors,
            });
        }

        res.status(500).json({
            message: "Lỗi server",
            error: error.message,
        });
    }
});

module.exports = router;
