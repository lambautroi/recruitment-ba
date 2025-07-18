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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Education", // Tham chiếu đến bảng Education
        }, // Trình độ học vấn của ứng viên
        experience: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Experience", // Tham chiếu đến bảng Experience
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
