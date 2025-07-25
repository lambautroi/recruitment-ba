const express = require("express");
const router = express.Router();
const Position = require("../../models/positionModel");

router.get("/", async (req, res) => {
    try {
        const positions = await Position.find({}).sort({ position_name: 1 });
        res.json(positions);
    } catch (error) {
        console.error("Error fetching positions:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách vị trí" });
    }
});

module.exports = router;
