const faker = require("faker");
const db = require("./db");
const Candidate = require("../models/candidateModel");
const User = require("../models/userModel");
const Experience = require("../models/experienceModel");
const Education = require("../models/educationModel");

// Lấy các người dùng có role là 'user'
User.find({ role: "user" }).then((users) => {
    if (users.length === 0) {
        console.log(
            "No users found with role 'user'. Please insert users first."
        );
        return;
    }

    const mockCandidates = [];

    // Lấy thông tin kinh nghiệm và trình độ học vấn ngẫu nhiên từ các bảng Experience và Education
    Experience.find({}).then((experiences) => {
        Education.find({}).then((educations) => {
            users.forEach((user) => {
                const randomExperience =
                    experiences[
                        faker.datatype.number({
                            min: 0,
                            max: experiences.length - 1,
                        })
                    ];
                const randomEducation =
                    educations[
                        faker.datatype.number({
                            min: 0,
                            max: educations.length - 1,
                        })
                    ];

                mockCandidates.push({
                    full_name: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    address: faker.address.streetAddress(), // Địa chỉ giả lập
                    education: randomEducation ? randomEducation._id : null, // Trình độ học vấn ngẫu nhiên
                    experience: randomExperience ? randomExperience._id : null, // Kinh nghiệm làm việc ngẫu nhiên
                    resume_file: faker.system.filePath(), // Đường dẫn file CV giả lập
                    profile_picture: faker.image.avatar(), // Ảnh đại diện giả lập
                });
            });

            // Chèn dữ liệu vào MongoDB sau khi tạo xong toàn bộ mock dữ liệu
            Candidate.insertMany(mockCandidates)
                .then(() => console.log("Mock candidates inserted"))
                .catch((err) =>
                    console.log("Error inserting candidates:", err)
                );
        });
    });
});
