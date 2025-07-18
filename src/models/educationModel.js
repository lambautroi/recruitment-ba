const mongoose = require("mongoose");

// Các mức độ trình độ học vấn
const educationSchema = new mongoose.Schema(
    {
        education_level: {
            type: String,
            required: true,
            enum: [
                "Tốt nghiệp THCS (9-12)",
                "Tốt nghiệp THPT (12/12)",
                "Đại học",
                "Cao đẳng",
                "Trung cấp",
                "Trên đại học",
                "Chưa qua đào tạo",
            ],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Education", educationSchema);
