const express = require("express");
const router = express.Router();
const Experience = require("../../models/experienceModel");

router.get("/", async (req, res) => {
    try {
        const experiences = await Experience.find({}).sort({
            experience_level: 1,
        });
        res.json(experiences);
    } catch (error) {
        console.error("Error fetching experiences:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách kinh nghiệm" });
    }
});

module.exports = router;
