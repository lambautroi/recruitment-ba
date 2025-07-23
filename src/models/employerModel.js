const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
    {
        employer_name: {
            type: String,
            required: true,
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
            required: true,
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
        },
        email: {
            type: String,
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Employer", employerSchema);
