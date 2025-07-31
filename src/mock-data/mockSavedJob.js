const faker = require("faker");
const db = require("./db");
const SavedJob = require("../models/savedJobModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");
const Candidate = require("../models/candidateModel");

console.log("Starting to create mock saved jobs...");

// Đợi connection sẵn sàng
setTimeout(async () => {
    try {
        console.log("Fetching data from database...");
        
        // Lấy dữ liệu với timeout dài hơn
        const users = await User.find({ role: "user" }).maxTimeMS(30000);
        
        if (users.length === 0) {
            console.log("No users found with role 'user'. Please insert users first.");
            process.exit(1);
            return;
        }
        console.log(`Found ${users.length} users`);

        const jobs = await Job.find({}).maxTimeMS(30000);
        
        if (jobs.length === 0) {
            console.log("No jobs found. Please insert jobs first.");
            process.exit(1);
            return;
        }
        console.log(`Found ${jobs.length} jobs`);

        const candidates = await Candidate.find({}).maxTimeMS(30000);
        
        if (candidates.length === 0) {
            console.log("No candidates found. Please insert candidates first.");
            process.exit(1);
            return;
        }
        console.log(`Found ${candidates.length} candidates`);

        const mockSavedJobs = [];

        users.forEach((user) => {
            // Tìm candidate theo email của user
            const candidate = candidates.find(c => c.email === user.email);

            if (candidate) {
                // Mỗi candidate sẽ lưu 2-5 jobs (giảm số lượng)
                const numSavedJobs = faker.datatype.number({ min: 2, max: 5 });
                const savedJobIds = new Set(); // Để tránh duplicate

                for (let i = 0; i < numSavedJobs && savedJobIds.size < jobs.length; i++) {
                    const randomJob = jobs[faker.datatype.number({ min: 0, max: jobs.length - 1 })];

                    // Kiểm tra xem đã save job này chưa
                    if (!savedJobIds.has(randomJob._id.toString())) {
                        savedJobIds.add(randomJob._id.toString());

                        const savedDate = faker.date.recent(30); // Trong vòng 30 ngày qua

                        mockSavedJobs.push({
                            candidate_id: candidate._id,
                            job_id: randomJob._id,
                            saved_date: savedDate
                        });
                    }
                }
            }
        });

        console.log(`Generated ${mockSavedJobs.length} mock saved jobs`);

        // Xóa dữ liệu cũ trước khi insert
        await SavedJob.deleteMany({});
        console.log("Cleared existing saved jobs");

        // Chèn dữ liệu vào MongoDB
        const result = await SavedJob.insertMany(mockSavedJobs);
        
        console.log(`Mock saved jobs inserted successfully: ${result.length} records`);
        console.log(`Total saved jobs: ${mockSavedJobs.length}`);
        console.log(`Average saved jobs per candidate: ${(mockSavedJobs.length / candidates.length).toFixed(1)}`);

        process.exit(0);

    } catch (err) {
        console.log("Error:", err.message);
        console.log("Full error:", err);
        process.exit(1);
    }
}, 3000); 