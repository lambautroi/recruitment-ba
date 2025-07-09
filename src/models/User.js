const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        }, // Tên người ứng tuyển/Tên doanh nghiệp
        email: {
            type: String,
            required: true,
            unique: true,
        }, // Email
        phone: {
            type: String,
            required: true,
        }, // Số điện thoại
        password: {
            type: String,
            required: true,
        }, // Mật khẩu
        role: {
            type: String,
            enum: ["user", "employer", "admin"],
            default: "user",
        }, // Role (user, employer, admin)
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
