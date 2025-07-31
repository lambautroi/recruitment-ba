const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        candidate_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
            required: true,
        },
        resume_file: {
            type: String,
            default: null,
        },
        applied_date: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["applied", "accepted", "rejected"],
            default: "applied",
        },
        cover_letter: {
            type: String,
        },
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

applicationSchema.index({ candidate_id: 1, job_id: 1 }, { unique: true });

applicationSchema.virtual("effective_resume_file").get(function () {
    return (
        this.resume_file ||
        (this.candidate_id && this.candidate_id.resume_file) ||
        null
    );
});

module.exports = mongoose.model("Application", applicationSchema);
