const faker = require("faker");
const db = require("./db"); // Kết nối MongoDB
const User = require("../models/userModel");

// Tạo dữ liệu giả cho người dùng
const mockUsers = [];

// Tạo 50 người dùng giả lập
for (let i = 0; i < 50; i++) {
    mockUsers.push({
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        password: faker.internet.password(),
        role: faker.random.arrayElement(["user", "employer", "admin"]),
    });
}

// Chèn dữ liệu vào MongoDB
User.insertMany(mockUsers)
    .then(() => console.log("Mock users inserted"))
    .catch((err) => console.log("Error inserting users:", err));
