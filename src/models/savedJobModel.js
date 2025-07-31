const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
    {
        candidate_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
            required: [true, "Candidate ID là bắt buộc"],
        },
        job_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: [true, "Job ID là bắt buộc"],
        },
        saved_date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

savedJobSchema.index({ candidate_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model("SavedJob", savedJobSchema);
