const faker = require("faker");
const db = require("./db");
const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");
const Candidate = require("../models/candidateModel");

console.log("🚀 Starting to create mock applications...");

// Đợi connection ổn định
setTimeout(async () => {
    try {
        console.log("📊 Fetching data from database...");

        // Lấy dữ liệu với timeout
        const [users, jobs, candidates] = await Promise.all([
            User.find({ role: "user" }).maxTimeMS(30000),
            Job.find({}).maxTimeMS(30000),
            Candidate.find({}).maxTimeMS(30000),
        ]);

        // Kiểm tra dữ liệu
        if (users.length === 0) {
            console.log("❌ No users found. Please create users first.");
            process.exit(1);
        }

        if (jobs.length === 0) {
            console.log("❌ No jobs found. Please create jobs first.");
            process.exit(1);
        }

        if (candidates.length === 0) {
            console.log(
                "❌ No candidates found. Please create candidates first."
            );
            process.exit(1);
        }

        console.log(
            `✅ Found ${users.length} users, ${jobs.length} jobs, ${candidates.length} candidates`
        );

        const mockApplications = [];

        // Cover letter templates theo ngành nghề
        const coverLetterTemplates = {
            IT: [
                "Tôi là một developer với đam mê công nghệ. Qua quá trình học tập và làm việc, tôi đã tích lũy được kinh nghiệm với JavaScript, React và Node.js. Tôi tin rằng có thể đóng góp tích cực cho dự án của công ty.",
                "Với nền tảng kỹ thuật vững chắc và khả năng học hỏi nhanh, tôi đã tham gia phát triển nhiều ứng dụng web. Tôi rất hứng thú với vị trí này và mong muốn được làm việc trong môi trường chuyên nghiệp.",
                "Tôi có kinh nghiệm phát triển full-stack và am hiểu các công nghệ hiện đại. Với tinh thần làm việc nhóm và kỹ năng giải quyết vấn đề, tôi tin sẽ phù hợp với yêu cầu công việc.",
                "Là một lập trình viên trẻ đầy nhiệt huyết, tôi luôn cập nhật kiến thức mới và áp dụng vào công việc. Tôi mong muốn được học hỏi và phát triển cùng với đội ngũ kỹ thuật của công ty.",
            ],
            Marketing: [
                "Tôi có niềm đam mê với marketing digital và đã có kinh nghiệm thực tế với Facebook Ads, Google Ads. Tôi tin rằng có thể đóng góp hiệu quả cho chiến lược marketing của công ty.",
                "Với khả năng sáng tạo content và hiểu biết về xu hướng thị trường, tôi đã thực hiện thành công nhiều chiến dịch marketing. Tôi rất quan tâm đến vị trí này.",
                "Tôi có kỹ năng phân tích dữ liệu và tư duy sáng tạo trong việc xây dựng thương hiệu. Với kinh nghiệm làm việc trong lĩnh vực marketing, tôi tin sẽ mang lại giá trị cho công ty.",
                "Marketing là đam mê của tôi. Tôi luôn theo dõi các xu hướng mới và có khả năng triển khai chiến lược marketing hiệu quả. Tôi mong muốn được áp dụng kinh nghiệm vào vị trí này.",
            ],
            "Kế toán": [
                "Với bằng cử nhân kế toán và kinh nghiệm thực tế, tôi thành thạo các phần mềm kế toán và am hiểu quy định thuế. Tôi tin rằng có thể đảm nhận tốt công việc này.",
                "Tôi có kinh nghiệm xử lý báo cáo tài chính và quản lý sổ sách kế toán. Với tính cẩn thận và chính xác cao, tôi mong muốn được đóng góp cho bộ phận tài chính của công ty.",
                "Là một kế toán viên tỉ mỉ và có trách nhiệm, tôi đã có kinh nghiệm làm việc với Excel nâng cao và các phần mềm kế toán chuyên nghiệp. Tôi rất quan tâm đến vị trí này.",
            ],
            "Nhân sự": [
                "Tôi có đam mê với công tác nhân sự và hiểu rõ tầm quan trọng của việc phát triển đội ngũ. Với kỹ năng giao tiếp tốt, tôi tin sẽ đóng góp hiệu quả cho bộ phận HR.",
                "Kinh nghiệm trong lĩnh vực tuyển dụng và quản lý nhân sự đã giúp tôi hiểu rõ nhu cầu của doanh nghiệp. Tôi mong muốn được áp dụng kiến thức vào vị trí này.",
                "Với khả năng đánh giá nhân sự và xây dựng chính sách HR, tôi đã có kinh nghiệm thực tế trong việc quản lý và phát triển nhân viên. Tôi rất hứng thú với cơ hội này.",
            ],
            "Bán hàng": [
                "Tôi có kinh nghiệm bán hàng và kỹ năng tư vấn khách hàng tốt. Với khả năng giao tiếp và thuyết phục, tôi tin rằng có thể đạt được mục tiêu doanh số của công ty.",
                "Là một người có đam mê với công việc kinh doanh, tôi đã có kinh nghiệm chăm sóc khách hàng và phát triển thị trường. Tôi mong muốn được đóng góp cho sự phát triển của công ty.",
                "Với kinh nghiệm bán hàng online và offline, tôi hiểu rõ tâm lý khách hàng và có khả năng xây dựng mối quan hệ tốt. Tôi rất quan tâm đến vị trí sales này.",
            ],
            default: [
                "Tôi rất quan tâm đến vị trí này và tin rằng kinh nghiệm cũng như kỹ năng của tôi phù hợp với yêu cầu công việc. Tôi mong muốn được đóng góp vào sự phát triển của công ty.",
                "Với tinh thần học hỏi và trách nhiệm cao, tôi tin rằng mình có thể thực hiện tốt công việc này. Tôi rất mong được cơ hội để chứng minh năng lực của mình.",
                "Tôi có động lực mạnh mẽ và sẵn sàng đối mặt với thử thách. Tôi tin rằng sự nhiệt huyết và chuyên nghiệp của tôi sẽ mang lại giá trị cho công ty.",
                "Đây là cơ hội mà tôi đã tìm kiếm. Với kinh nghiệm và kỹ năng hiện có, tôi tin rằng có thể đáp ứng tốt yêu cầu công việc và phát triển cùng công ty.",
            ],
        };

        // Notes từ HR perspective
        const hrNotes = [
            "CV ấn tượng, kinh nghiệm phù hợp",
            "Candidate có potential tốt",
            "Skills match với yêu cầu",
            "Cần xem xét kỹ hơn",
            "Profile khá thú vị",
            "Ứng viên tiềm năng",
            "Cần phỏng vấn để đánh giá thêm",
            "Background tốt",
            "Đáng để consider",
            "Kinh nghiệm đa dạng",
        ];

        // Tạo applications cho từng user
        users.forEach((user, userIndex) => {
            console.log(
                `Processing user ${userIndex + 1}/${users.length}: ${
                    user.email
                }`
            );

            // Tìm candidate tương ứng
            const candidate = candidates.find((c) => c.email === user.email);

            if (!candidate) {
                console.log(`⚠️  No candidate found for user: ${user.email}`);
                return;
            }

            // Mỗi candidate apply từ 1-5 jobs
            const numApplications = faker.datatype.number({ min: 1, max: 5 });
            const appliedJobIds = new Set();

            for (let i = 0; i < numApplications; i++) {
                // Chọn random job
                const randomJob =
                    jobs[
                        faker.datatype.number({ min: 0, max: jobs.length - 1 })
                    ];

                // Tránh apply trùng job
                if (appliedJobIds.has(randomJob._id.toString())) {
                    continue;
                }
                appliedJobIds.add(randomJob._id.toString());

                // Ngày apply trong vòng 60 ngày qua
                const appliedDate = faker.date.recent(60);

                // Chọn cover letter template (60% có cover letter)
                let coverLetter = null;
                if (faker.datatype.boolean({ probability: 0.6 })) {
                    // Determine category từ job hoặc candidate
                    let category = "default";
                    if (candidate.category_id) {
                        // Có thể map category_id to category name ở đây
                        category = "default";
                    }

                    const templates =
                        coverLetterTemplates[category] ||
                        coverLetterTemplates["default"];
                    coverLetter = faker.random.arrayElement(templates);
                }

                // Trạng thái với tỷ lệ thực tế
                const status = faker.random.arrayElement([
                    "applied",
                    "applied",
                    "applied",
                    "applied",
                    "applied",
                    "applied",
                    "applied", // 70%
                    "accepted",
                    "accepted", // 20%
                    "rejected", // 10%
                ]);

                // HR notes (40% có notes)
                const notes = faker.datatype.boolean({ probability: 0.4 })
                    ? faker.random.arrayElement(hrNotes)
                    : null;

                // Resume file (ưu tiên từ candidate)
                const resumeFile =
                    candidate.resume_file ||
                    `/uploads/candidates/cvs/cv-${
                        candidate._id
                    }-${faker.datatype.uuid()}.pdf`;

                mockApplications.push({
                    job_id: randomJob._id,
                    candidate_id: candidate._id,
                    resume_file: resumeFile,
                    applied_date: appliedDate,
                    status: status,
                    cover_letter: coverLetter,
                    notes: notes,
                });
            }
        });

        console.log(
            `📝 Generated ${mockApplications.length} mock applications`
        );

        // Thống kê trước khi insert
        const statusCount = mockApplications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});

        const coverLetterCount = mockApplications.filter(
            (app) => app.cover_letter
        ).length;
        const notesCount = mockApplications.filter((app) => app.notes).length;

        console.log("📊 Preview statistics:");
        console.log("- Status distribution:", statusCount);
        console.log(
            `- With cover letter: ${coverLetterCount}/${
                mockApplications.length
            } (${Math.round(
                (coverLetterCount / mockApplications.length) * 100
            )}%)`
        );
        console.log(
            `- With HR notes: ${notesCount}/${
                mockApplications.length
            } (${Math.round((notesCount / mockApplications.length) * 100)}%)`
        );

        // Insert vào database
        console.log("💾 Inserting into database...");

        const result = await Application.insertMany(mockApplications);

        console.log("✅ Insert completed successfully!");

        // Thống kê cuối cùng
        const finalStats = {
            total: result.length,
            applied: result.filter((app) => app.status === "applied").length,
            accepted: result.filter((app) => app.status === "accepted").length,
            rejected: result.filter((app) => app.status === "rejected").length,
            with_cover_letter: result.filter((app) => app.cover_letter).length,
            with_notes: result.filter((app) => app.notes).length,
            avg_per_candidate:
                Math.round((result.length / candidates.length) * 10) / 10,
        };

        console.log("\n🎉 FINAL STATISTICS:");
        console.log(`📊 Total applications: ${finalStats.total}`);
        console.log(`📈 Status breakdown:`);
        console.log(
            `   - Applied: ${finalStats.applied} (${Math.round(
                (finalStats.applied / finalStats.total) * 100
            )}%)`
        );
        console.log(
            `   - Accepted: ${finalStats.accepted} (${Math.round(
                (finalStats.accepted / finalStats.total) * 100
            )}%)`
        );
        console.log(
            `   - Rejected: ${finalStats.rejected} (${Math.round(
                (finalStats.rejected / finalStats.total) * 100
            )}%)`
        );
        console.log(
            `💌 With cover letter: ${
                finalStats.with_cover_letter
            } (${Math.round(
                (finalStats.with_cover_letter / finalStats.total) * 100
            )}%)`
        );
        console.log(
            `📝 With HR notes: ${finalStats.with_notes} (${Math.round(
                (finalStats.with_notes / finalStats.total) * 100
            )}%)`
        );
        console.log(
            `👤 Average applications per candidate: ${finalStats.avg_per_candidate}`
        );

        console.log("\n🚀 Mock applications created successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating mock applications:", error);
        console.error("Error details:", error.message);

        if (error.name === "MongoTimeoutError") {
            console.log(
                "💡 Suggestion: Check if MongoDB is running and connection is stable"
            );
        }

        process.exit(1);
    }
}, 3000);
