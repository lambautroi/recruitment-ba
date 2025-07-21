const express = require("express");
const router = express.Router();
const Job = require("../models/jobModel");
const Category = require("../models/categoryModel");

// API để lấy 10 danh mục có số lượng tin tuyển dụng nhiều nhất
router.get("/featured-jobs", async (req, res) => {
    try {
        const categories = await Category.find();
        const Employer = require("../models/employerModel");
        
        const categoriesWithJobCount = await Promise.all(
            categories.map(async (category) => {
                // Tìm employers thuộc category này
                const employers = await Employer.find({
                    category_id: category._id,
                });
                
                // Đếm số jobs của các employers này
                const employerIds = employers.map(emp => emp._id);
                const jobCount = await Job.countDocuments({
                    employer_id: { $in: employerIds },
                    status: "active",
                });
                
                return {
                    categoryName: category.category_name,
                    jobCount,
                    categoryId: category._id,
                    employerIds
                };
            })
        );

        const topCategories = categoriesWithJobCount
            .sort((a, b) => b.jobCount - a.jobCount)
            .slice(0, 10);

        const featuredJobs = await Promise.all(
            topCategories.map(async (category) => {
                const jobs = await Job.find({
                    employer_id: { $in: category.employerIds },
                    status: "active",
                })
                    .sort({ posted_at: -1 })
                    .limit(5);

                return {
                    categoryName: category.categoryName,
                    jobs: jobs,
                };
            })
        );

        res.json(featuredJobs); // Trả về tin tuyển dụng nổi bật theo danh mục
    } catch (error) {
        console.error("Lỗi khi lấy tin tuyển dụng nổi bật", error);
        res.status(500).json({ message: "Lỗi khi lấy tin tuyển dụng nổi bật" });
    }
});

module.exports = router;
