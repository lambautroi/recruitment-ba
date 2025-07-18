const mongoose = require("mongoose");

// Các hình thức làm việc
const formOfEmploymentSchema = new mongoose.Schema(
    {
        form_name: {
            type: String,
            required: true,
            enum: [
                "Toàn thời gian",
                "Bán thời gian",
                "Thực tập",
                "Làm việc từ xa",
                "Cộng tác viên",
                "Khác",
            ],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("FormOfEmployment", formOfEmploymentSchema);
