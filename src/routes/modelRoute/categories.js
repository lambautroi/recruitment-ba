const express = require("express");
const router = express.Router();
const Category = require("../../models/categoryModel");

router.get("/", async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ category_name: 1 });
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách danh mục" });
    }
});

module.exports = router;
