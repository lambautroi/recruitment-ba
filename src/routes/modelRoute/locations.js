const express = require("express");
const router = express.Router();
const Location = require("../../models/locationModel");

router.get("/", async (req, res) => {
    try {
        const locations = await Location.find({}).sort({ location_name: 1 });
        res.json(locations);
    } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách địa điểm" });
    }
});

module.exports = router;
