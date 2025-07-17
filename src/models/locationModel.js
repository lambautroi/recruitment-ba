const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    location_name: { type: String, required: true },
});

module.exports = mongoose.model("Location", locationSchema);
