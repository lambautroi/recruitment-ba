const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidateModel");
const Location = require("../models/locationModel");
const Category = require("../models/categoryModel");
const Position = require("../models/positionModel");
const Experience = require("../models/experienceModel");
const Education = require("../models/educationModel");

// GET /api/candidates/filter-options - Lấy các options cho bộ lọc
router.get("/filter-options", async (req, res) => {
    try {
        const [locations, categories, positions, experiences, educations] =
            await Promise.all([
                Location.find({}).select("_id location_name"),
                Category.find({}).select("_id category_name"),
                Position.find({}).select("_id position_name"),
                Experience.find({}).select("_id experience_level"),
                Education.find({}).select("_id education_level"),
            ]);

        res.json({
            locations,
            categories,
            positions,
            experiences,
            educations,
        });
    } catch (error) {
        console.error("Error fetching filter options:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/candidates/filter - Lấy danh sách candidates với bộ lọc
router.get("/filter", async (req, res) => {
    try {
        const {
            search = "",
            location = "",
            category = "",
            position = "",
            experience = "",
            education = "",
            gender = "",
            sort = "newest",
            limit = 10,
        } = req.query;

        // Xây dựng query filter
        let filter = { status: "active" }; // Chỉ lấy candidates đang active

        // Tìm kiếm theo tên
        if (search) {
            filter.full_name = { $regex: search, $options: "i" };
        }

        // Lọc theo địa điểm
        if (location) {
            filter.location_id = location;
        }

        // Lọc theo danh mục nghề nghiệp
        if (category) {
            filter.category_id = category;
        }

        // Lọc theo cấp bậc/chức vụ
        if (position) {
            filter.position_id = position;
        }

        // Lọc theo kinh nghiệm
        if (experience) {
            filter.experience = experience;
        }

        // Lọc theo trình độ học vấn
        if (education) {
            filter.education = education;
        }

        // Lọc theo giới tính
        if (gender) {
            filter.gender = gender;
        }

        // Xây dựng sort options
        let sortOptions = {};
        switch (sort) {
            case "newest":
            case "Mới nhất":
                sortOptions = { createdAt: -1 };
                break;
            case "oldest":
            case "Cũ nhất":
                sortOptions = { createdAt: 1 };
                break;
            case "name_asc":
                sortOptions = { full_name: 1 };
                break;
            case "name_desc":
                sortOptions = { full_name: -1 };
                break;
            default:
                sortOptions = { createdAt: -1 };
        }

        // Thực hiện query với populate
        const candidates = await Candidate.find(filter)
            .populate("location_id", "location_name")
            .populate("category_id", "category_name")
            .populate("position_id", "position_name")
            .populate("experience", "experience_level")
            .populate("education", "education_level")
            .sort(sortOptions)
            .limit(parseInt(limit));

        // Format dữ liệu trả về
        const formattedCandidates = candidates.map((candidate) => ({
            _id: candidate._id,
            name: candidate.full_name,
            email: candidate.email,
            phone: candidate.phone,
            profile_picture: candidate.profile_picture,
            position_name:
                candidate.position_id?.position_name || "Chưa xác định",
            category_name:
                candidate.category_id?.category_name || "Chưa xác định",
            location_name:
                candidate.location_id?.location_name || "Chưa xác định",
            experience_level:
                candidate.experience?.experience_level || "Chưa xác định",
            education_level:
                candidate.education?.education_level || "Chưa xác định",
            skills: candidate.skills || [],
            gender: candidate.gender,
            salary_expectation: candidate.salary_expectation,
            createdAt: candidate.createdAt,
        }));

        res.json(formattedCandidates);
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/candidates/:id - Lấy thông tin chi tiết một candidate
router.get("/:id", async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id)
            .populate("location_id", "location_name")
            .populate("category_id", "category_name")
            .populate("position_id", "position_name")
            .populate("experience", "experience_level")
            .populate("education", "education_level");

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        const formattedCandidate = {
            _id: candidate._id,
            name: candidate.full_name,
            email: candidate.email,
            phone: candidate.phone,
            address: candidate.address,
            profile_picture: candidate.profile_picture,
            position_name:
                candidate.position_id?.position_name || "Chưa xác định",
            category_name:
                candidate.category_id?.category_name || "Chưa xác định",
            location_name:
                candidate.location_id?.location_name || "Chưa xác định",
            experience_level:
                candidate.experience?.experience_level || "Chưa xác định",
            education_level:
                candidate.education?.education_level || "Chưa xác định",
            skills: candidate.skills || [],
            gender: candidate.gender,
            salary_expectation: candidate.salary_expectation,
            resume_file: candidate.resume_file,
            status: candidate.status,

            birth_date: candidate.birth_date,
            marital_status: candidate.marital_status,
            career_objective: candidate.career_objective,
            work_preference: candidate.work_preference || [],
            professional_skills: candidate.professional_skills || [],
            soft_skills: candidate.soft_skills || [],

            createdAt: candidate.createdAt,
        };

        res.json(formattedCandidate);
    } catch (error) {
        console.error("Error fetching candidate details:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
