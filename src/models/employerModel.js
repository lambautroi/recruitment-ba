const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
    {
        employer_name: {
            type: String,
            required: true,
        }, // Tên công ty (Employer)
        employer_logo: {
            type: String,
        }, // Logo công ty
        employer_description: {
            type: String,
        }, // Mô tả công ty
        contact_info: {
            type: String,
        }, // Thông tin liên hệ
        location_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
        }, // Địa chỉ công ty (tham chiếu từ bảng Location)
    },
    { timestamps: true }
);

module.exports = mongoose.model("Employer", employerSchema);
