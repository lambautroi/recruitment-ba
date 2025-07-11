const db = require("./db"); // Kết nối MongoDB
const Category = require("../models/categoryModel");

const popularCategories = [
    "Công nghệ thông tin",
    "Kế toán - Kiểm toán",
    "Nhân sự",
    "Marketing",
    "Bán hàng",
    "Tài chính - Ngân hàng",
    "Giáo dục - Đào tạo",
    "Xây dựng",
    "Y tế - Dược",
    "Sản xuất - Vận hành",
    "Vận tải - Logistics",
    "Luật - Pháp lý",
    "Du lịch - Nhà hàng - Khách sạn",
    "Thiết kế - Mỹ thuật",
    "Truyền thông - Báo chí",
    "Quản lý dự án",
    "Bảo hiểm",
    "Điện - Điện tử",
    "Cơ khí - Kỹ thuật",
    "Bất động sản",
];

const mockCategories = popularCategories.map((name) => ({
    category_name: name,
}));

Category.insertMany(mockCategories)
    .then(() => console.log("Mock categories inserted"))
    .catch((err) => console.log("Error inserting categories:", err));
