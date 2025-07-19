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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Employer", employerSchema);
