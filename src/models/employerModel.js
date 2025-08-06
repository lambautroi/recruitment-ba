const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
    {
        employer_name: {
            type: String,
            required: false,
            trim: true
        },
        employer_logo: {
            type: String,
        },
        employer_description: {
            type: String,
        },
        contact_info: {
            type: String,
        },
        location_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: false, 
        },
        num_job: {
            type: Number,
            default: 0,
        },
        established_date: {
            type: Date,
        },
        tax_code: {
            type: String,
        },
        company_size: {
            type: String,
            enum: [
                "Dưới 50 nhân viên",
                "50-100 nhân viên", 
                "100-500 nhân viên",
                "Trên 500 nhân viên",
            ],
        },
        business_license: {
            type: String,
        },
        phone: {
            type: String,
            required: false, 
        },
        email: {
            type: String,
            required: true,  
            unique: true, // ✅ SỬA: Chỉ dùng unique: true, không dùng index: true
            trim: true,
            lowercase: true
        },
        website: {
            type: String,
        },
        address: {
            type: String,
        },
        industry: {
            type: String,
        },
        business_type: {
            type: String,
            enum: [
                "Công ty TNHH",
                "Công ty cổ phần",
                "Doanh nghiệp tư nhân",
                "Khác",
            ],
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports = mongoose.model("Employer", employerSchema);