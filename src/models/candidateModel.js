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
        }, // Địa chỉ ứng viên
        education: {
            type: String,
        }, // Trình độ học vấn của ứng viên
        skills: {
            type: String,
        }, // Kỹ năng của ứng viên
        experience: {
            type: String,
        }, // Kinh nghiệm làm việc của ứng viên
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
