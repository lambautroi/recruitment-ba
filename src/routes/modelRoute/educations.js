const express = require("express");
const router = express.Router();
const Education = require("../../models/educationModel");

router.get("/", async (req, res) => {
    try {
        const educations = await Education.find({}).sort({
            education_level: 1,
        });
        res.json(educations);
    } catch (error) {
        console.error("Error fetching educations:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách trình độ học vấn",
        });
    }
});

module.exports = router;
