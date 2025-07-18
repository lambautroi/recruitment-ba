const mongoose = require("mongoose");

// Các mức độ kinh nghiệm
const experienceSchema = new mongoose.Schema(
    {
        experience_level: {
            type: String,
            required: true,
            enum: [
                "Dưới 1 năm kinh nghiệm",
                "Từ 1-2 năm kinh nghiệm",
                "Từ 2-3 năm kinh nghiệm",
                "Từ 3-4 năm kinh nghiệm",
                "Từ 4-5 năm kinh nghiệm",
                "Trên 5 năm kinh nghiệm",
            ],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);
