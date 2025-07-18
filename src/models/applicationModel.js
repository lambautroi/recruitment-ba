const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }, // Tham chiếu tới bảng Job
        candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Tham chiếu tới bảng User (ứng viên)
        resume_file: { type: String }, // Đường dẫn tới file CV của ứng viên
        status: {
            type: String,
            enum: ["applied", "accepted", "rejected"],
            default: "applied",
        }, // Trạng thái ứng tuyển (applied, accepted, rejected)
        applied_at: { type: Date, default: Date.now }, // Thời gian ứng tuyển
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
