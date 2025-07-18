const faker = require("faker");
const db = require("./db");
const Education = require("../models/educationModel");

// Tạo dữ liệu mock cho trình độ học vấn
const mockEducations = [
    { education_level: "Tốt nghiệp THCS (9-12)" },
    { education_level: "Tốt nghiệp THPT (12/12)" },
    { education_level: "Đại học" },
    { education_level: "Cao đẳng" },
    { education_level: "Trung cấp" },
    { education_level: "Trên đại học" },
    { education_level: "Chưa qua đào tạo" },
];

Education.insertMany(mockEducations)
    .then(() => console.log("Mock educations inserted"))
    .catch((err) => console.log("Error inserting educations:", err));
