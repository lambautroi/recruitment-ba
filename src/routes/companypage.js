const express = require("express");
const router = express.Router();
const Employer = require("../models/employerModel");
const Location = require("../models/locationModel");
const Category = require("../models/categoryModel");

// GET /api/companies/filter-options - Lấy các options cho bộ lọc
router.get("/filter-options", async (req, res) => {
    try {
        const [locations, categories] = await Promise.all([
            Location.find({}).select("_id location_name"),
            Category.find({}).select("_id category_name"),
        ]);

        res.json({
            locations,
            categories,
        });
    } catch (error) {
        console.error("Error fetching filter options:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/companies/filter - Lấy danh sách companies với bộ lọc
router.get("/filter", async (req, res) => {
    try {
        const {
            search = "",
            location = "",
            industry = "", // category_id
            sort = "newest",
            limit = 10,
        } = req.query;

        // Xây dựng query filter
        let filter = {};

        // Tìm kiếm theo tên công ty
        if (search) {
            filter.employer_name = { $regex: search, $options: "i" };
        }

        // Lọc theo địa điểm
        if (location) {
            filter.location_id = location;
        }

        // Lọc theo ngành nghề (category)
        if (industry) {
            filter.category_id = industry;
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
            case "most_jobs":
                sortOptions = { num_job: -1 };
                break;
            case "least_jobs":
                sortOptions = { num_job: 1 };
                break;
            case "name_asc":
                sortOptions = { employer_name: 1 };
                break;
            case "name_desc":
                sortOptions = { employer_name: -1 };
                break;
            default:
                sortOptions = { createdAt: -1 };
        }

        // Thực hiện query với populate
        const companies = await Employer.find(filter)
            .populate("location_id", "location_name")
            .populate("category_id", "category_name")
            .sort(sortOptions)
            .limit(parseInt(limit));

        // Format dữ liệu trả về
        const formattedCompanies = companies.map((company) => ({
            _id: company._id,
            name: company.employer_name,
            logo: company.employer_logo,
            industry: company.category_id?.category_name || "Chưa xác định",
            location_name: company.location_id?.location_name || "Chưa xác định",
            description: company.employer_description,
            contact_info: company.contact_info,
            jobCount: company.num_job,
            createdAt: company.createdAt,
        }));

        res.json(formattedCompanies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/companies/:id - Lấy thông tin chi tiết một company
router.get("/:id", async (req, res) => {
    try {
        const company = await Employer.findById(req.params.id)
            .populate("location_id", "location_name")
            .populate("category_id", "category_name");

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const formattedCompany = {
            _id: company._id,
            name: company.employer_name,
            logo: company.employer_logo,
            industry: company.category_id?.category_name || "Chưa xác định",
            location_name: company.location_id?.location_name || "Chưa xác định",
            description: company.employer_description,
            contact_info: company.contact_info,
            jobCount: company.num_job,
            createdAt: company.createdAt,
        };

        res.json(formattedCompany);
    } catch (error) {
        console.error("Error fetching company details:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
