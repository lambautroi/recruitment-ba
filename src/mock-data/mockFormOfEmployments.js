const faker = require("faker");
const db = require("./db");
const FormOfEmployment = require("../models/formOfEmploymentModel");

// Tạo dữ liệu mock cho hình thức làm việc
const mockForms = [
    { form_name: "Toàn thời gian" },
    { form_name: "Bán thời gian" },
    { form_name: "Thực tập" },
    { form_name: "Làm việc từ xa" },
    { form_name: "Cộng tác viên" },
    { form_name: "Khác" },
];

FormOfEmployment.insertMany(mockForms)
    .then(() => console.log("Mock form of employment inserted"))
    .catch((err) => console.log("Error inserting form of employment:", err));
