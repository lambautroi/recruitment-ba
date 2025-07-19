const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
        }, // Tên ứng viên (lấy từ bảng User)
        email: {
            type: String,
            required: true,
            unique: true,
        }, // Email ứng viên (lấy từ bảng User)
        phone: {
            type: String,
            required: true,
        }, // Số điện thoại ứng viên (lấy từ bảng User)
        address: {
            type: String,
        }, // Địa chỉ chi tiết của ứng viên
        location_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
        }, // Tỉnh/Thành phố
        position_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Position",
        }, // Cấp bậc/Chức vụ mong muốn
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        }, // Danh mục nghề nghiệp
        education: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Education", // Tham chiếu đến bảng Education
        }, // Trình độ học vấn của ứng viên
        experience: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Experience", // Tham chiếu đến bảng Experience
        }, // Kinh nghiệm làm việc của ứng viên
        skills: [{
            type: String,
        }], // Kỹ năng của ứng viên (array)
        gender: {
            type: String,
            enum: ["Nam", "Nữ", "Khác"],
        }, // Giới tính
        salary_expectation: {
            type: String,
        }, // Mức lương mong muốn (VD: "3 - 5 triệu")
        status: {
            type: String,
            enum: ["active", "inactive", "hired"],
            default: "active",
        }, // Trạng thái tìm việc
        resume_file: {
            type: String,
        }, // Đường dẫn file CV của ứng viên
        profile_picture: {
            type: String,
        }, // Ảnh đại diện của ứng viên
    },
    { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
