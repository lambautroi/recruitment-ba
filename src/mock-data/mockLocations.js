const faker = require("faker");
const db = require("./db"); // Kết nối MongoDB
const Location = require("../models/locationModel");

const vietnamProvinces = [
    "Hà Nội",
    "TP Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "Bình Dương",
    "Đồng Nai",
    "Quảng Ninh",
    "Thanh Hóa",
    "Nghệ An",
    "Huế",
    "Khánh Hòa",
    "Bắc Ninh",
    "Hải Dương",
    "Lâm Đồng",
    "Quảng Nam",
    "Thái Nguyên",
    "Vĩnh Phúc",
    "Bình Thuận",
    "Long An",
];

const mockLocations = vietnamProvinces.map((name) => ({
    location_name: name,
}));

Location.insertMany(mockLocations)
    .then(() => console.log("Mock locations inserted"))
    .catch((err) => console.log("Error inserting locations:", err));
