const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true }, // Tiêu đề công việc
        employer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" }, // Tham chiếu tới bảng Employer
        location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Location" }, // Tham chiếu tới bảng Location
        position_id: { type: mongoose.Schema.Types.ObjectId, ref: "Position" }, // Tham chiếu tới bảng Position (Cấp bậc)
        experience_id: { type: mongoose.Schema.Types.ObjectId, ref: "Experience" }, // Tham chiếu tới bảng Experience (Kinh nghiệm)
        education_id: { type: mongoose.Schema.Types.ObjectId, ref: "Education" }, // Tham chiếu tới bảng Education (Trình độ học vấn)
        form_of_employment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FormOfEmployment",
        }, // Tham chiếu tới bảng FormOfEmployment (Hình thức làm việc)
        salary_range: { type: String }, // Mức lương
        job_description: { type: String }, // Mô tả công việc
        posted_at: { type: Date, default: Date.now }, // Ngày đăng công việc
        expiration_date: { type: Date }, // Ngày hết hạn
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        }, // Trạng thái công việc (active hoặc inactive)
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
