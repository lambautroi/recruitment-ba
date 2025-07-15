const express = require("express");
const router = express.Router();
const HomepageSetting = require("../models/HomepageSetting");

// API để lưu hoặc cập nhật cài đặt trang chủ
router.post("/save-homepage-settings", async (req, res) => {
    const { title, subtitle, buttonText, buttonLink } = req.body;

    try {
        let homepageSettings = await HomepageSetting.findOne();

        if (homepageSettings) {
            homepageSettings.title = title;
            homepageSettings.subtitle = subtitle;
            homepageSettings.buttonText = buttonText;
            homepageSettings.buttonLink = buttonLink;

            await homepageSettings.save();
        } else {
            homepageSettings = new HomepageSetting({
                title,
                subtitle,
                buttonText,
                buttonLink,
            });

            await homepageSettings.save();
        }

        res.status(200).json({ message: "Cài đặt trang chủ đã được lưu!" });
    } catch (error) {
        console.error("Lỗi khi lưu cài đặt trang chủ", error);
        res.status(500).json({ message: "Lỗi khi lưu cài đặt trang chủ" });
    }
});

// API để lấy cài đặt trang chủ
router.get("/homepage-settings", async (req, res) => {
    try {
        const settings = await HomepageSetting.findOne();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy cài đặt trang chủ" });
    }
});

module.exports = router;
