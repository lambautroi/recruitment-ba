const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
        },
        location_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
        },
        position_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Position",
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        education: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Education",
        },
        experience: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Experience",
        },
        skills: [
            {
                type: String,
            },
        ],
        gender: {
            type: String,
            enum: ["Nam", "Nữ", "Khác"],
        },
        salary_expectation: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "hired"],
            default: "active",
        },
        resume_file: {
            type: String,
        },
        profile_picture: {
            type: String,
        },

        birth_date: {
            type: Date,
        },
        marital_status: {
            type: String,
            enum: ["Độc thân", "Đã kết hôn", "Khác"],
            default: "Độc thân",
        },
        career_objective: {
            type: String,
        },
        work_preference: [
            {
                type: String,
            },
        ],
        professional_skills: [
            {
                type: String,
            },
        ],
        soft_skills: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
