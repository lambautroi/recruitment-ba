const express = require("express");
const router = express.Router();
const Job = require("../models/jobModel");
const Category = require("../models/categoryModel");

router.get("/categories-with-jobs", async (req, res) => {
    try {
        const categories = await Category.find();

        const categoriesWithJobCount = await Promise.all(
            categories.map(async (category) => {
                const jobCount = await Job.countDocuments({
                    category_id: category._id,
                });
                return {
                    categoryName: category.category_name,
                    jobCount,
                };
            })
        );

        const topCategories = categoriesWithJobCount
            .sort((a, b) => b.jobCount - a.jobCount)
            .slice(0, 10);

        res.json(topCategories);
    } catch (error) {
        console.error(
            "Lỗi khi lấy danh mục tuyển dụng và tin tuyển dụng",
            error
        );
        res.status(500).json({
            message: "Lỗi khi lấy danh mục tuyển dụng và tin tuyển dụng",
        });
    }
});

module.exports = router;
