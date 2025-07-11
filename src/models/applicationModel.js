const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
        candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Tham chiếu tới bảng User
        resume_file: { type: String },
        status: { type: String, enum: ["applied", "accepted", "rejected"] },
        applied_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
