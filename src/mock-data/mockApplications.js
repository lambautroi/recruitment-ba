const faker = require("faker");
const db = require("./db");
const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");
const Candidate = require("../models/candidateModel");

// Lấy các người dùng có role là 'user'
User.find({ role: "user" }).then((users) => {
    Job.find({}).then((jobs) => {
        Candidate.find({}).then((candidates) => {
            const mockApplications = [];

            users.forEach((user) => {
                const randomJob =
                    jobs[faker.datatype.number({ min: 0, max: jobs.length - 1 })];
                
                // Tìm candidate theo email của user
                const candidate = candidates.find(c => c.email === user.email);

                mockApplications.push({
                    job_id: randomJob._id,
                    candidate_id: user._id,
                    resume_file: candidate ? candidate.resume_file : faker.system.filePath(), // Lấy resume_file từ candidate
                    status: faker.random.arrayElement([
                        "applied",
                        "accepted",
                        "rejected",
                    ]),
                    applied_at: faker.date.recent(),
                });
            });

            // Chèn dữ liệu vào MongoDB
            Application.insertMany(mockApplications)
                .then(() => console.log("Mock applications inserted"))
                .catch((err) => console.log("Error inserting applications:", err));
        });
    });
});