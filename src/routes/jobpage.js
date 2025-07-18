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
        const filter = {};

        if (search) filter.title = { $regex: search, $options: "i" };
        if (location) filter.location_id = location;
        if (category) filter.category_id = category;
        if (position) filter.position_id = position;
        if (formOfEmployment) filter.form_of_employment_id = formOfEmployment;
        if (experience) filter.experience_id = experience;
        if (education) filter.education_id = education;
        if (salaryRange) {
            // Lọc theo mức lương tối thiểu
            const minSalary = parseInt(salaryRange);
            filter.salary_range = { $gte: minSalary.toString() };
        }

        // Lọc và trả về các công việc
        const jobs = await Job.find(filter)
            .populate("employer_id", "company_name")
            .populate("location_id", "location_name")
            .populate("category_id", "category_name")
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
                job.employer_id?.company_name || "Không có thông tin",
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

module.exports = router;
