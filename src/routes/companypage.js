const express = require("express");
const router = express.Router();
const Employer = require("../models/employerModel");
const Job = require("../models/jobModel");
const Location = require("../models/locationModel");
const Category = require("../models/categoryModel");

// ✅ HÀM HELPER XỬ LÝ LOGO URL
const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;

    // Nếu là đường dẫn tương đối từ uploads
    if (logoPath.startsWith("/uploads/")) {
        return logoPath;
    }

    // Nếu là URL đầy đủ
    if (logoPath.startsWith("http")) {
        return logoPath;
    }

    // Nếu chỉ là tên file, thêm đường dẫn uploads
    if (!logoPath.startsWith("/")) {
        return `/uploads/logos/${logoPath}`;
    }

    return logoPath;
};

// GET /api/companies/filter-options
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

// GET /api/companies/filter
router.get("/filter", async (req, res) => {
    try {
        const {
            search = "",
            location = "",
            industry = "",
            sort = "newest",
            limit = 10,
        } = req.query;

        let filter = {};

        if (search) {
            filter.employer_name = { $regex: search, $options: "i" };
        }

        if (location) {
            filter.location_id = location;
        }

        if (industry) {
            filter.category_id = industry;
        }

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

        const companies = await Employer.find(filter)
            .populate("location_id", "location_name")
            .populate("category_id", "category_name")
            .sort(sortOptions)
            .limit(parseInt(limit));

        const formattedCompanies = await Promise.all(
            companies.map(async (company) => {
                const jobCount = await Job.countDocuments({
                    employer_id: company._id,
                    status: "active",
                });

                return {
                    _id: company._id,
                    name: company.employer_name,
                    // ✅ SỬA: XỬ LÝ LOGO URL ĐÚNG CÁCH
                    logo: getLogoUrl(company.employer_logo),
                    industry:
                        company.category_id?.category_name || "Chưa xác định",
                    location_name:
                        company.location_id?.location_name || "Chưa xác định",
                    description: company.employer_description,
                    contact_info: company.contact_info,
                    jobCount: jobCount,
                    createdAt: company.createdAt,
                };
            })
        );

        res.json(formattedCompanies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/companies/:id
router.get("/:id", async (req, res) => {
    try {
        const employer = await Employer.findById(req.params.id)
            .populate("location_id", "location_name")
            .populate("category_id", "category_name");

        if (!employer) {
            return res.status(404).json({ message: "Employer not found" });
        }

        const jobs = await Job.find({
            employer_id: req.params.id,
            status: "active",
        })
            .populate("location_id", "location_name")
            .populate("category_id", "category_name")
            .populate("position_id", "position_name")
            .populate("experience_id", "experience_level")
            .populate("education_id", "education_level")
            .populate("form_of_employment_id", "form_name")
            .sort({ createdAt: -1 });

        const formattedEmployer = {
            _id: employer._id,
            name: employer.employer_name,
            // ✅ SỬA: XỬ LÝ LOGO URL ĐÚNG CÁCH
            logo: getLogoUrl(employer.employer_logo),
            description: employer.employer_description,
            contact_info: employer.contact_info,
            location_name:
                employer.location_id?.location_name || "Chưa xác định",
            category_name:
                employer.category_id?.category_name || "Chưa xác định",
            num_job: jobs.length,
            established_date: employer.established_date,
            tax_code: employer.tax_code,
            company_size: employer.company_size,
            business_license: employer.business_license,
            phone: employer.phone,
            email: employer.email,
            website: employer.website,
            address: employer.address,
            industry: employer.industry,
            business_type: employer.business_type,
            createdAt: employer.createdAt,
        };

        const formattedJobs = jobs.map((job) => ({
            _id: job._id,
            title: job.title,
            location_name: job.location_id?.location_name || "Chưa xác định",
            category_name: job.category_id?.category_name || "Chưa xác định",
            position_name: job.position_id?.position_name || "Chưa xác định",
            experience_name:
                job.experience_id?.experience_level || "Chưa xác định",
            education_name:
                job.education_id?.education_level || "Chưa xác định",
            form_name: job.form_of_employment_id?.form_name || "Chưa xác định",
            salary_range: job.salary_range,
            deadline: job.expiration_date,
            createdAt: job.createdAt,
            // ✅ THÊM: LOGO CÔNG TY CHO MỖI JOB
            company_logo: getLogoUrl(employer.employer_logo),
            company_name: employer.employer_name,
        }));

        res.json({
            employer: formattedEmployer,
            jobs: formattedJobs,
        });
    } catch (error) {
        console.error("Error fetching employer details:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
