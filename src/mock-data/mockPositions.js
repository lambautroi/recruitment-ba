const faker = require("faker");
const db = require("./db");
const Position = require("../models/positionModel");

// Tạo dữ liệu mock cho cấp bậc/chức vụ
const mockPositions = [
    { position_name: "Lao động phổ thông" },
    { position_name: "Thực tập sinh" },
    { position_name: "Nhân viên" },
    { position_name: "Quản lý" },
];

Position.insertMany(mockPositions)
    .then(() => console.log("Mock positions inserted"))
    .catch((err) => console.log("Error inserting positions:", err));
