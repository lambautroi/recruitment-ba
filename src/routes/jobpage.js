const express = require("express");
const router = express.Router();
const Job = require("../models/jobModel");
const Category = require("../models/categoryModel");
const Location = require("../models/locationModel");
const Position = require("../models/positionModel");
const Experience = require("../models/experienceModel");
const Education = require("../models/educationModel");
const FormOfEmployment = require("../models/formOfEmploymentModel");

// Route lấy tất cả các giá trị để populate các dropdown
router.get("/filter-options", async (req, res) => {
    try {
        const locations = await Location.find();
        const categories = await Category.find();
        const positions = await Position.find();
        const experiences = await Experience.find();
        const formOfEmployments = await FormOfEmployment.find();
        const educations = await Education.find();

        res.json({
            locations,
            categories,
            positions,
            experiences,
            formOfEmployments,
            educations,
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin filter options", error);
        res.status(500).json({
            message: "Lỗi khi lấy thông tin filter options",
        });
    }
});

// Route lọc công việc theo các bộ lọc
router.get("/filter", async (req, res) => {
    try {
        const {
            search,
            location,
            category,
            position,
            formOfEmployment,
            salaryRange,
            experience,
            education,
            limit,
            sort,
        } = req.query;

        // Tạo filter cho công việc
        let filter = {};
        filter.status = "active";

        if (search) filter.title = { $regex: search, $options: "i" };
        if (location) filter.location_id = location;
        if (position) filter.position_id = position;
        if (formOfEmployment) filter.form_of_employment_id = formOfEmployment;
        if (experience) filter.experience_id = experience;
        if (education) filter.education_id = education;
        if (category) {
            filter.category_id = category;
        }
        if (salaryRange) {
            const minSalary = parseInt(salaryRange);
            filter.salary_range = { $gte: minSalary.toString() };
        }

        // Lọc và trả về các công việc với populate employer để lấy category
        const jobs = await Job.find(filter)
            .populate({
                path: "employer_id",
                select: "employer_name category_id",
            })
            .populate("category_id", "category_name")
            .populate("location_id", "location_name")
            .populate("position_id", "position_name")
            .populate("experience_id", "experience_level")
            .populate("education_id", "education_level")
            .populate("form_of_employment_id", "form_name")
            .limit(limit ? parseInt(limit) : 10)
            .sort(sort === "newest" ? { posted_at: -1 } : { posted_at: 1 });

        // Format lại dữ liệu để trả về theo format mong muốn
        const formattedJobs = jobs.map((job) => ({
            _id: job._id,
            title: job.title,
            employer_name:
                job.employer_id?.employer_name || "Không có thông tin",
            location_name:
                job.location_id?.location_name || "Không có thông tin",
            category_name:
                job.category_id?.category_name || "Không có thông tin",
            position_name:
                job.position_id?.position_name || "Không có thông tin",
            experience_name:
                job.experience_id?.experience_level || "Không có thông tin",
            education_name:
                job.education_id?.education_level || "Không có thông tin",
            form_name:
                job.form_of_employment_id?.form_name || "Không có thông tin",
            salary_range: job.salary_range || "Thỏa thuận",
            job_description: job.job_description,
            posted_at: job.posted_at,
            expiration_date: job.expiration_date,
            status: job.status,
        }));

        res.json(formattedJobs);
    } catch (error) {
        console.error("Lỗi khi lấy công việc", error);
        res.status(500).json({ message: "Lỗi khi lấy công việc" });
    }
});

// GET /api/jobs/:id - Lấy thông tin chi tiết một job
router.get("/:id", async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            status: "active",
        })
            .populate({
                path: "employer_id",
                select: "employer_name employer_logo employer_description contact_info category_id location_id",
                populate: {
                    path: "category_id location_id",
                    select: "category_name location_name",
                },
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
                .json({ message: "Job not found or inactive" });
        }

        const formattedJob = {
            _id: job._id,
            title: job.title,
            employer: {
                _id: job.employer_id?._id,
                name: job.employer_id?.employer_name || "Không có thông tin",
                logo: job.employer_id?.employer_logo,
                description: job.employer_id?.employer_description,
                contact_info: job.employer_id?.contact_info,
                category_name:
                    job.employer_id?.category_id?.category_name ||
                    "Chưa xác định",
                location_name:
                    job.employer_id?.location_id?.location_name ||
                    "Chưa xác định",
            },
            category_name:
                job.category_id?.category_name || "Không có thông tin", // ✅ THÊM: Category của job
            location_name:
                job.location_id?.location_name || "Không có thông tin",
            position_name:
                job.position_id?.position_name || "Không có thông tin",
            experience_level:
                job.experience_id?.experience_level || "Không có thông tin",
            education_level:
                job.education_id?.education_level || "Không có thông tin",
            form_name:
                job.form_of_employment_id?.form_name || "Không có thông tin",
            salary_range: job.salary_range || "Thỏa thuận",
            quantity: job.quantity || 1,
            job_description: job.job_description || {},
            posted_at: job.posted_at,
            expiration_date: job.expiration_date,
            status: job.status,
            createdAt: job.createdAt,
        };

        res.json(formattedJob);
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết công việc", error);
        res.status(500).json({ message: "Lỗi khi lấy chi tiết công việc" });
    }
});

module.exports = router;
