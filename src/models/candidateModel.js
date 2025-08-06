const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: false,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: false,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        birth_date: {
            type: Date,
            validate: {
                validator: function (value) {
                    if (!value) return true;

                    const today = new Date();
                    const birthDate = new Date(value);
                    const minDate = new Date(
                        today.getFullYear() - 100,
                        today.getMonth(),
                        today.getDate()
                    );
                    const maxDate = new Date(
                        today.getFullYear() - 16,
                        today.getMonth(),
                        today.getDate()
                    );

                    return birthDate >= minDate && birthDate <= maxDate;
                },
                message: "Ngày sinh phải từ 16 đến 100 tuổi",
            },
        },
        gender: {
            type: String,
            enum: ["Nam", "Nữ", "Khác"],
        },
        marital_status: {
            type: String,
            enum: ["Độc thân", "Đã kết hôn", "Khác"],
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
        salary_expectation: {
            type: String,
        },
        career_objective: {
            type: String,
        },
        work_preference: {
            type: [String],
            default: [],
        },
        professional_skills: {
            type: [String],
            default: [],
        },
        soft_skills: {
            type: [String],
            default: [],
        },
        skills: {
            type: [String],
            default: [],
        },
        profile_picture: {
            type: String,
        },
        resume_file: {
            type: String,
        },
        facebook: {
            type: String,
            validate: {
                validator: function (value) {
                    if (!value) return true;
                    const urlPattern = /^https?:\/\/(www\.)?facebook\.com\/.+/;
                    return urlPattern.test(value);
                },
                message: "URL Facebook không hợp lệ",
            },
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        updated_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = mongoose.model("Candidate", candidateSchema);
