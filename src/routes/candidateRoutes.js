const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Application = require("../models/applicationModel");
const SavedJob = require("../models/savedJobModel");
const Job = require("../models/jobModel");
const Candidate = require("../models/candidateModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");

// Tạo thư mục uploads nếu chưa có
const uploadsDir = path.join(__dirname, "..", "..", "uploads", "candidates");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình multer cho avatar
const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const avatarDir = path.join(uploadsDir, "avatars");
        if (!fs.existsSync(avatarDir)) {
            fs.mkdirSync(avatarDir, { recursive: true });
        }
        cb(null, avatarDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
    },
});

// Cấu hình multer cho CV
const cvStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const cvDir = path.join(uploadsDir, "cvs");
        if (!fs.existsSync(cvDir)) {
            fs.mkdirSync(cvDir, { recursive: true });
        }
        cb(null, cvDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "cv-" + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter cho avatar (chỉ cho phép ảnh)
const avatarFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ được phép tải lên file ảnh!"), false);
    }
};

// File filter cho CV (PDF, DOC, DOCX)
const cvFileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ được phép tải lên file PDF, DOC hoặc DOCX!"), false);
    }
};

const uploadAvatar = multer({
    storage: avatarStorage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: avatarFileFilter,
});

const uploadCV = multer({
    storage: cvStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: cvFileFilter,
});

// GET /api/candidate/profile - Lấy thông tin profile
router.get("/profile", auth, async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Access denied" });
        }

        const candidate = await Candidate.findOne({
            email: req.user.email,
        })
            .populate("location_id", "location_name")
            .populate("position_id", "position_name")
            .populate("category_id", "category_name")
            .populate("education", "education_level")
            .populate("experience", "experience_level");

        if (!candidate) {
            // Tạo candidate mới nếu chưa có
            const newCandidate = new Candidate({
                email: req.user.email,
                full_name: req.user.full_name || "",
            });

            await newCandidate.save();
            return res.json(newCandidate);
        }

        res.json(candidate);
    } catch (error) {
        console.error("Error fetching candidate profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT /api/candidate/profile - Cập nhật thông tin profile
router.put("/profile", auth, async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Access denied" });
        }

        // Lọc dữ liệu trước khi cập nhật
        const updateData = {};
        Object.keys(req.body).forEach((key) => {
            const value = req.body[key];
            if (value !== "" && value !== null && value !== undefined) {
                updateData[key] = value;
            }
        });

        const candidate = await Candidate.findOneAndUpdate(
            { email: req.user.email },
            updateData,
            { new: true, runValidators: true, upsert: true }
        );

        res.json({ message: "Profile updated successfully", candidate });
    } catch (error) {
        console.error("Error updating candidate profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// POST /api/candidate/upload-avatar - Upload avatar
router.post(
    "/upload-avatar",
    auth,
    uploadAvatar.single("avatar"),
    async (req, res) => {
        try {
            if (req.user.role !== "user") {
                return res.status(403).json({ message: "Access denied" });
            }

            if (!req.file) {
                return res
                    .status(400)
                    .json({ message: "Không có file được tải lên" });
            }

            const avatarUrl = `/uploads/candidates/avatars/${req.file.filename}`;

            // Cập nhật avatar trong database
            const candidate = await Candidate.findOneAndUpdate(
                { email: req.user.email },
                { profile_picture: avatarUrl },
                { new: true, upsert: true }
            );

            res.json({
                message: "Upload avatar thành công",
                avatarUrl: avatarUrl,
                candidate: candidate,
            });
        } catch (error) {
            console.error("Error uploading avatar:", error);
            res.status(500).json({
                message: "Lỗi khi upload avatar",
                error: error.message,
            });
        }
    }
);

// POST /api/candidate/upload-cv - Upload CV
router.post("/upload-cv", auth, uploadCV.single("cv"), async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Access denied" });
        }

        if (!req.file) {
            return res
                .status(400)
                .json({ message: "Không có file được tải lên" });
        }

        const cvUrl = `/uploads/candidates/cvs/${req.file.filename}`;

        // Cập nhật CV trong database
        const candidate = await Candidate.findOneAndUpdate(
            { email: req.user.email },
            {
                resume_file: cvUrl,
                updated_at: new Date(),
            },
            { new: true, upsert: true }
        );

        res.json({
            message: "Upload CV thành công",
            cvUrl: cvUrl,
            candidate: candidate,
        });
    } catch (error) {
        console.error("Error uploading CV:", error);
        res.status(500).json({
            message: "Lỗi khi upload CV",
            error: error.message,
        });
    }
});

// DELETE /api/candidate/delete-avatar - Xóa avatar
router.delete("/delete-avatar", auth, async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Access denied" });
        }

        const candidate = await Candidate.findOne({ email: req.user.email });

        if (candidate && candidate.profile_picture) {
            // Xóa file cũ
            const oldAvatarPath = path.join(
                __dirname,
                "..",
                "..",
                candidate.profile_picture
            );
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }

            // Cập nhật database
            candidate.profile_picture = "";
            await candidate.save();
        }

        res.json({ message: "Xóa avatar thành công" });
    } catch (error) {
        console.error("Error deleting avatar:", error);
        res.status(500).json({
            message: "Lỗi khi xóa avatar",
            error: error.message,
        });
    }
});

// DELETE /api/candidate/delete-cv - Xóa CV
router.delete("/delete-cv", auth, async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Access denied" });
        }

        const candidate = await Candidate.findOne({ email: req.user.email });

        if (candidate && candidate.resume_file) {
            // Xóa file cũ
            const oldCvPath = path.join(
                __dirname,
                "..",
                "..",
                candidate.resume_file
            );
            if (fs.existsSync(oldCvPath)) {
                fs.unlinkSync(oldCvPath);
            }

            // Cập nhật database
            candidate.resume_file = "";
            await candidate.save();
        }

        res.json({ message: "Xóa CV thành công" });
    } catch (error) {
        console.error("Error deleting CV:", error);
        res.status(500).json({
            message: "Lỗi khi xóa CV",
            error: error.message,
        });
    }
});

// Thay thế route GET /api/candidate/applied-jobs
router.get("/applied-jobs", auth, async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Access denied" });
        }

        const candidate = await Candidate.findOne({
            email: req.user.email,
        });

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        // ✅ SỬA: Populate thêm candidate để lấy resume_file
        const applications = await Application.find({
            candidate_id: candidate._id,
        })
            .populate({
                path: "job_id",
                populate: [
                    {
                        path: "employer_id",
                        select: "employer_name",
                    },
                    {
                        path: "location_id",
                        select: "location_name",
                    },
                    {
                        path: "category_id",
                        select: "category_name",
                    },
                ],
            })
            .populate({
                path: "candidate_id",
                select: "resume_file full_name",
            })
            .sort({ applied_date: -1 });

        // ✅ SỬA: Format dữ liệu với resume_file từ candidate
        const formattedApplications = applications.map((app) => ({
            _id: app._id,
            job: {
                _id: app.job_id._id,
                title: app.job_id.title,
                employer_name:
                    app.job_id.employer_id?.employer_name || "Unknown Company",
                location_name:
                    app.job_id.location_id?.location_name || "Unknown Location",
                category_name:
                    app.job_id.category_id?.category_name || "Unknown Category",
                salary_range: app.job_id.salary_range || "Thỏa thuận",
                job_type: app.job_id.job_type || "Full-time",
                deadline: app.job_id.deadline,
            },
            applied_date: app.applied_date,
            status: app.status,
            // ✅ SỬA: Ưu tiên resume_file từ application, nếu không có thì lấy từ candidate
            resume_file:
                app.resume_file || app.candidate_id?.resume_file || null,
            cover_letter: app.cover_letter,
            notes: app.notes,
            // Thêm thông tin status mapping cho UI
            status_text: getStatusText(app.status),
            status_color: getStatusColor(app.status),
            days_since_applied: Math.floor(
                (new Date() - new Date(app.applied_date)) /
                    (1000 * 60 * 60 * 24)
            ),
        }));

        res.json(formattedApplications);
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

function getStatusText(status) {
    const statusMap = {
        applied: "Đã ứng tuyển",
        accepted: "Được chấp nhận",
        rejected: "Bị từ chối",
    };
    return statusMap[status] || status;
}

function getStatusColor(status) {
    const colorMap = {
        applied: "blue",
        accepted: "green",
        rejected: "red",
    };
    return colorMap[status] || "gray";
}

// route GET /api/candidate/saved-jobs
router.get("/saved-jobs", auth, async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Access denied" });
        }

        const candidate = await Candidate.findOne({
            email: req.user.email,
        });

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        const savedJobs = await SavedJob.find({
            candidate_id: candidate._id,
        })
            .populate({
                path: "job_id",
                populate: [
                    {
                        path: "employer_id",
                        select: "employer_name logo",
                    },
                    {
                        path: "location_id",
                        select: "location_name",
                    },
                    {
                        path: "category_id",
                        select: "category_name",
                    },
                ],
            })
            .sort({ saved_date: -1 });

        const formattedSavedJobs = savedJobs
            .filter((saved) => saved.job_id)
            .map((saved) => {
                const job = saved.job_id;

                return {
                    _id: saved._id,
                    saved_date: saved.saved_date,
                    days_since_saved: Math.floor(
                        (new Date() - new Date(saved.saved_date)) /
                            (1000 * 60 * 60 * 24)
                    ),
                    job: {
                        _id: job._id,
                        title: job.title,
                        description: job.description,
                        requirements: job.requirements,
                        salary_range: job.salary_range || "Thỏa thuận",
                        job_type: job.job_type || "Full-time",
                        deadline: job.deadline,
                        benefits: job.benefits,
                        employer_name:
                            job.employer_id?.employer_name || "Unknown Company",
                        employer_logo: job.employer_id?.logo || null,
                        location_name:
                            job.location_id?.location_name ||
                            "Unknown Location",
                        category_name:
                            job.category_id?.category_name ||
                            "Unknown Category",
                        createdAt: job.createdAt,
                        status: job.status || "active",
                    },
                };
            });

        res.json(formattedSavedJobs);
    } catch (error) {
        console.error("Error fetching saved jobs:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// POST /api/candidate/save-job - Lưu công việc
router.post("/save-job", auth, async (req, res) => {
    try {
        const { job_id } = req.body;

        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Access denied" });
        }

        const candidate = await Candidate.findOne({
            email: req.user.email,
        });

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        // Kiểm tra xem job đã được lưu chưa
        const existingSave = await SavedJob.findOne({
            candidate_id: candidate._id,
            job_id: job_id,
        });

        if (existingSave) {
            return res.status(400).json({ message: "Job already saved" });
        }

        // Tạo saved job mới
        const newSavedJob = new SavedJob({
            candidate_id: candidate._id,
            job_id: job_id,
            saved_date: new Date(),
        });

        await newSavedJob.save();

        res.status(201).json({ message: "Job saved successfully" });
    } catch (error) {
        console.error("Error saving job:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE /api/candidate/saved-jobs/:id - Xóa công việc đã lưu
router.delete("/saved-jobs/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Access denied" });
        }

        const candidate = await Candidate.findOne({
            email: req.user.email,
        });

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        // Xóa saved job
        const deletedSave = await SavedJob.findOneAndDelete({
            _id: id,
            candidate_id: candidate._id,
        });

        if (!deletedSave) {
            return res.status(404).json({ message: "Saved job not found" });
        }

        res.json({ message: "Saved job removed successfully" });
    } catch (error) {
        console.error("Error removing saved job:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// route POST /api/candidate/apply-job
router.post("/apply-job", auth, async (req, res) => {
    try {
        const { job_id, cover_letter } = req.body;

        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Access denied" });
        }

        const candidate = await Candidate.findOne({
            email: req.user.email,
        });

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        if (!candidate.resume_file) {
            return res.status(400).json({
                message:
                    "Bạn cần tải lên CV trước khi ứng tuyển. Vui lòng cập nhật thông tin cá nhân.",
            });
        }

        const existingApplication = await Application.findOne({
            candidate_id: candidate._id,
            job_id: job_id,
        });

        if (existingApplication) {
            return res
                .status(400)
                .json({ message: "Bạn đã ứng tuyển vị trí này rồi" });
        }

        const newApplication = new Application({
            job_id: job_id,
            candidate_id: candidate._id,
            resume_file: candidate.resume_file,
            cover_letter: cover_letter || null,
            applied_date: new Date(),
            status: "applied",
        });

        await newApplication.save();

        res.status(201).json({
            message: "Ứng tuyển thành công!",
            application: newApplication,
        });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Route để check application status
router.get("/application-status/:jobId", auth, async (req, res) => {
    try {
        const { jobId } = req.params;
        const candidateId = req.user.id;

        const application = await Application.findOne({
            candidate_id: candidateId,
            job_id: jobId,
        });

        if (!application) {
            return res.json({ status: null });
        }

        res.json({ status: application.status });
    } catch (error) {
        console.error("Error checking application status:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});
module.exports = router;
