const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        employer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" }, // Tham chiếu tới bảng Employer
        category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
        salary_range: { type: String },
        job_description: { type: String },
        posted_at: { type: Date, default: Date.now },
        expiration_date: { type: Date },
        status: { type: String, enum: ["active", "inactive"] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
