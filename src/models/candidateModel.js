const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
    {
        // Thông tin cơ bản
        full_name: {
            type: String,
            required: [true, "Họ và tên là bắt buộc"],
            trim: true,
            maxlength: [100, "Họ và tên không được vượt quá 100 ký tự"],
        },
        email: {
            type: String,
            required: [true, "Email là bắt buộc"],
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Email không hợp lệ",
            ],
        },
        phone: {
            type: String,
            required: [true, "Số điện thoại là bắt buộc"],
            match: [/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"],
        },
        address: {
            type: String,
            trim: true,
        },

        // References
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

        // Thông tin cá nhân
        gender: {
            type: String,
            enum: {
                values: ["Nam", "Nữ", "Khác"],
                message: "Giới tính phải là Nam, Nữ hoặc Khác",
            },
        },
        birth_date: {
            type: Date,
            validate: {
                validator: function (value) {
                    if (!value) return true;
                    const age =
                        (new Date() - new Date(value)) /
                        (365.25 * 24 * 60 * 60 * 1000);
                    return age >= 16 && age <= 70;
                },
                message: "Tuổi phải từ 16 đến 70",
            },
        },
        marital_status: {
            type: String,
            enum: {
                values: ["Độc thân", "Đã kết hôn", "Khác"],
                message: "Tình trạng hôn nhân không hợp lệ",
            },
            default: "Độc thân",
        },

        // Thông tin công việc
        salary_expectation: {
            type: String,
            enum: {
                values: [
                    "3 - 5 triệu",
                    "5 - 7 triệu",
                    "7 - 10 triệu",
                    "10 - 15 triệu",
                    "15 - 20 triệu",
                    "Trên 20 triệu",
                    "Thỏa thuận",
                ],
                message: "Mức lương mong muốn không hợp lệ",
            },
        },
        career_objective: {
            type: String,
            trim: true,
            maxlength: [
                2000,
                "Mục tiêu nghề nghiệp không được vượt quá 2000 ký tự",
            ],
        },
        work_preference: [
            {
                type: String,
                trim: true,
            },
        ],

        // Kỹ năng
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        professional_skills: [
            {
                type: String,
                trim: true,
            },
        ],
        soft_skills: [
            {
                type: String,
                trim: true,
            },
        ],

        // Files
        resume_file: {
            type: String,
            trim: true,
        },
        profile_picture: {
            type: String,
            trim: true,
        },

        // Status
        status: {
            type: String,
            enum: {
                values: ["active", "inactive", "hired", "blocked"],
                message: "Trạng thái không hợp lệ",
            },
            default: "active",
        },

        // *** THÊM CÁC TRƯỜNG MỚI CẦN THIẾT ***

        // Social media (chỉ facebook như trong form)
        facebook: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    if (!value) return true;
                    return /^https?:\/\/(www\.)?facebook\.com\/.*/.test(value);
                },
                message: "Link Facebook không hợp lệ",
            },
        },

        // Profile completion tracking
        profile_completion: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        // Thời gian cập nhật profile lần cuối
        last_profile_update: {
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

// *** INDEXES - Tăng tốc độ truy vấn ***
candidateSchema.index({ email: 1 });
candidateSchema.index({ location_id: 1 });
candidateSchema.index({ category_id: 1 });
candidateSchema.index({ position_id: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ createdAt: -1 });
candidateSchema.index({
    full_name: "text",
    career_objective: "text",
    professional_skills: "text",
    soft_skills: "text",
});

// *** VIRTUAL - Tính tuổi tự động ***
candidateSchema.virtual("age").get(function () {
    if (!this.birth_date) return null;
    const today = new Date();
    const birthDate = new Date(this.birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    return age;
});

// *** PRE-SAVE MIDDLEWARE - Tự động tính % hoàn thành profile ***
candidateSchema.pre("save", function (next) {
    // Các trường bắt buộc (70% điểm)
    const requiredFields = [
        "full_name",
        "email",
        "phone",
        "gender",
        "birth_date",
        "location_id",
        "category_id",
        "education",
        "experience",
        "salary_expectation",
    ];

    // Các trường tùy chọn (30% điểm)
    const optionalFields = [
        "profile_picture",
        "resume_file",
        "address",
        "career_objective",
        "professional_skills",
        "soft_skills",
        "facebook",
    ];

    let completedRequired = 0;
    let completedOptional = 0;

    // Đếm trường bắt buộc đã điền
    requiredFields.forEach((field) => {
        if (this[field] && this[field] !== "") {
            completedRequired++;
        }
    });

    // Đếm trường tùy chọn đã điền
    optionalFields.forEach((field) => {
        if (this[field]) {
            if (Array.isArray(this[field]) && this[field].length > 0) {
                completedOptional++;
            } else if (!Array.isArray(this[field]) && this[field] !== "") {
                completedOptional++;
            }
        }
    });

    // Tính điểm hoàn thành
    const requiredScore = (completedRequired / requiredFields.length) * 70;
    const optionalScore = (completedOptional / optionalFields.length) * 30;

    this.profile_completion = Math.round(requiredScore + optionalScore);
    this.last_profile_update = new Date();

    next();
});

// *** INSTANCE METHODS - Các phương thức tiện ích ***
candidateSchema.methods.isProfileComplete = function () {
    return this.profile_completion >= 80;
};

candidateSchema.methods.getPublicProfile = function () {
    return {
        _id: this._id,
        full_name: this.full_name,
        profile_picture: this.profile_picture,
        location_id: this.location_id,
        category_id: this.category_id,
        position_id: this.position_id,
        experience: this.experience,
        education: this.education,
        professional_skills: this.professional_skills,
        soft_skills: this.soft_skills,
        career_objective: this.career_objective,
        age: this.age,
        createdAt: this.createdAt,
    };
};

// *** STATIC METHODS - Các phương thức tĩnh ***
candidateSchema.statics.findActiveProfiles = function (filters = {}) {
    return this.find({
        ...filters,
        status: "active",
    });
};

candidateSchema.statics.searchByText = function (searchQuery, filters = {}) {
    return this.find({
        $text: { $search: searchQuery },
        status: "active",
        ...filters,
    }).sort({ score: { $meta: "textScore" }, createdAt: -1 });
};

module.exports = mongoose.model("Candidate", candidateSchema);
