const faker = require("faker");
const db = require("./db"); // Kết nối MongoDB
const Candidate = require("../models/candidateModel");
const User = require("../models/userModel");

// Lấy các người dùng có role là 'user'
User.find({ role: "user" }).then((users) => {
    if (users.length === 0) {
        console.log(
            "No users found with role 'user'. Please insert users first."
        );
        return;
    }

    const mockCandidates = [];

    // Tạo dữ liệu mock cho ứng viên (Candidate) từ thông tin của User
    users.forEach((user) => {
        mockCandidates.push({
            full_name: user.fullName,
            email: user.email,
            phone: user.phone,
            address: faker.address.streetAddress(), // Địa chỉ giả lập
            education: faker.lorem.words(3), // Trình độ học vấn giả lập
            skills: faker.lorem.words(5), // Kỹ năng giả lập
            experience: faker.lorem.sentences(2), // Kinh nghiệm làm việc giả lập
            resume_file: faker.system.filePath(), // Đường dẫn file CV giả lập
            profile_picture: faker.image.avatar(), // Ảnh đại diện giả lập
        });
    });

    // Chèn dữ liệu vào MongoDB
    Candidate.insertMany(mockCandidates)
        .then(() => console.log("Mock candidates inserted"))
        .catch((err) => console.log("Error inserting candidates:", err));
});
