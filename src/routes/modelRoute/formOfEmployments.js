const express = require("express");
const router = express.Router();
const FormOfEmployment = require("../../models/formOfEmploymentModel");

router.get("/", async (req, res) => {
    try {
        const formOfEmployments = await FormOfEmployment.find({}).sort({
            form_name: 1,
        });
        res.json(formOfEmployments);
    } catch (error) {
        console.error("Error fetching form of employments:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách hình thức làm việc",
        });
    }
});

module.exports = router;
