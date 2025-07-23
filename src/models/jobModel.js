const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        employer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" },
        location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
        category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // ✅ THÊM TRƯỜNG NÀY
        position_id: { type: mongoose.Schema.Types.ObjectId, ref: "Position" },
        experience_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Experience",
        },
        education_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Education",
        },
        form_of_employment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FormOfEmployment",
        },
        salary_range: { type: String },
        quantity: { type: Number, default: 1 },
        job_description: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        posted_at: { type: Date, default: Date.now },
        expiration_date: { type: Date },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
