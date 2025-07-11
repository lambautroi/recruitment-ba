const faker = require("faker");
const db = require("./db"); // Kết nối MongoDB
const Employer = require("../models/employerModel");

// Tạo dữ liệu giả cho doanh nghiệp
const mockEmployers = [];

// Tạo 20 doanh nghiệp giả lập
for (let i = 0; i < 20; i++) {
    mockEmployers.push({
        employer_name: faker.company.companyName(),
        employer_logo: faker.image.imageUrl(),
        employer_description: faker.company.catchPhrase(),
        contact_info: faker.phone.phoneNumber(),
    });
}

// Chèn dữ liệu vào MongoDB
Employer.insertMany(mockEmployers)
    .then(() => console.log("Mock employers inserted"))
    .catch((err) => console.log("Error inserting employers:", err));
