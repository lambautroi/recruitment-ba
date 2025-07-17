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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Employer", employerSchema);
