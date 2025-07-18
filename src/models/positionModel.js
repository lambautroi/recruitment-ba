const mongoose = require("mongoose");

// Các cấp bậc/chức vụ
const positionSchema = new mongoose.Schema(
    {
        position_name: {
            type: String,
            required: true,
            enum: [
                "Lao động phổ thông",
                "Thực tập sinh",
                "Nhân viên",
                "Quản lý",
            ],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Position", positionSchema);
