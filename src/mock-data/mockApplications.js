const faker = require("faker");
const db = require("./db"); // Kết nối MongoDB
const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");

// Tạo dữ liệu giả cho ứng tuyển
const mockApplications = [];

// Tạo 20 hồ sơ ứng tuyển giả lập
Job.find({}).then((jobs) => {
    User.find({ role: "user" }).then((users) => {
        for (let i = 0; i < 20; i++) {
            mockApplications.push({
                job_id: jobs[
                    faker.datatype.number({ min: 0, max: jobs.length - 1 })
                ]._id,
                candidate_id:
                    users[
                        faker.datatype.number({ min: 0, max: users.length - 1 })
                    ]._id,
                resume_file: faker.system.filePath(),
                status: faker.random.arrayElement([
                    "applied",
                    "accepted",
                    "rejected",
                ]),
            });
        }

        Application.insertMany(mockApplications)
            .then(() => console.log("Mock applications inserted"))
            .catch((err) => console.log("Error inserting applications:", err));
    });
});
