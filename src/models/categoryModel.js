const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    category_name: { type: String, required: true }, // Tên danh mục công việc
});

module.exports = mongoose.model("Category", categorySchema);
