const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    location_name: { type: String, required: true }, // Tên địa điểm
});

module.exports = mongoose.model("Location", locationSchema);
