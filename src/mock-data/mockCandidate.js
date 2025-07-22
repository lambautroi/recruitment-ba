const faker = require("faker");
const db = require("./db");
const Candidate = require("../models/candidateModel");
const User = require("../models/userModel");
const Experience = require("../models/experienceModel");
const Education = require("../models/educationModel");
const Location = require("../models/locationModel");
const Position = require("../models/positionModel");
const Category = require("../models/categoryModel");

// Lấy các người dùng có role là 'user'
User.find({ role: "user" }).then((users) => {
    if (users.length === 0) {
        console.log(
            "No users found with role 'user'. Please insert users first."
        );
        return;
    }

    const mockCandidates = [];

    // Lấy thông tin từ các bảng liên quan
    Promise.all([
        Experience.find({}),
        Education.find({}),
        Location.find({}),
        Position.find({}),
        Category.find({}),
    ])
        .then(([experiences, educations, locations, positions, categories]) => {
            // Danh sách kỹ năng mẫu theo ngành nghề
            const skillsByCategory = {
                IT: [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "ReactJS",
                    "NodeJS",
                    "Python",
                    "Laravel",
                    "PHP",
                    "MySQL",
                    "MongoDB",
                ],
                "Kế toán": [
                    "Tính toán lương",
                    "Tính toán số sách",
                    "Excel",
                    "Kế toán doanh nghiệp",
                    "Báo cáo tài chính",
                ],
                Marketing: [
                    "Social Media",
                    "Google Ads",
                    "Facebook Ads",
                    "Content Marketing",
                    "SEO",
                    "Photoshop",
                ],
                "Nhân sự": [
                    "Tuyển dụng",
                    "Quản lý nhân sự",
                    "Đào tạo",
                    "Lương thưởng",
                    "Luật lao động",
                ],
                "Bán hàng": [
                    "Tư vấn khách hàng",
                    "Thương lượng",
                    "Chăm sóc khách hàng",
                    "Bán hàng online",
                ],
            };

            // ...existing code...

            // Mức lương mong muốn
            const salaryRanges = [
                "3 - 5 triệu",
                "5 - 7 triệu",
                "7 - 10 triệu",
                "10 - 15 triệu",
                "15 - 20 triệu",
                "Trên 20 triệu",
                "Thỏa thuận",
            ];

            // ✅ THÊM DỮ LIỆU MỚI
            const careerObjectives = {
                IT: [
                    "Trong quá trình học tập, tôi đã hoàn thành nhiều dự án thực tế, bao gồm việc phát triển hệ thống quản lý thông tin, ứng dụng thương mại điện tử và các trang web động. Ngoài ra, tôi cũng đã thực tập tại một công ty phần mềm, nơi tôi có cơ hội học hỏi và áp dụng các kiến thức vào môi trường làm việc thực tế.",
                    "Tôi là một kỹ sư phần mềm mới tốt nghiệp với sự đam mê mãnh liệt trong việc phát triển và triển khai các giải pháp công nghệ sáng tạo. Được đào tạo bài bản trong ngành Kỹ thuật Phần mềm, tôi đã tích lũy được một nền tảng kiến thức vững chắc về lập trình, quản lý cơ sở dữ liệu, và phát triển ứng dụng web.",
                ],
                "Kế toán": [
                    "Tôi là một nhân viên kế toán với niềm đam mê về số liệu và báo cáo tài chính. Với kiến thức vững chắc về kế toán doanh nghiệp và thuế, tôi luôn cố gắng đảm bảo tính chính xác và tuân thủ quy định.",
                    "Mục tiêu của tôi là trở thành một chuyên gia kế toán giỏi, có thể hỗ trợ doanh nghiệp trong việc quản lý tài chính hiệu quả.",
                ],
                Marketing: [
                    "Tôi đam mê marketing và truyền thông, với khả năng sáng tạo nội dung hấp dẫn và hiểu biết về các kênh digital marketing hiện đại.",
                    "Mục tiêu của tôi là xây dựng thương hiệu mạnh và tăng trưởng doanh số thông qua các chiến lược marketing hiệu quả.",
                ],
            };

            const workPreferences = [
                ["Hà Nội", "TP.HCM", "Đà Nẵng"],
                ["Cần Thơ", "An Giang", "Kiên Giang"],
                ["Hậu Giang", "Sóc Trăng", "Bạc Liêu"],
                ["Kiên Giang", "Cần Thơ", "Hậu Giang", "Sóc Trăng"],
                ["Toàn quốc"],
            ];

            const professionalSkillsByCategory = {
                IT: [
                    "Lập trình",
                    "Phát triển web",
                    "Quản lý dữ liệu",
                    "Kỹ năng giải quyết vấn đề",
                ],
                "Kế toán": [
                    "Lập báo cáo tài chính",
                    "Kế toán thuế",
                    "Phân tích tài chính",
                    "Quản lý ngân sách",
                ],
                Marketing: [
                    "Digital Marketing",
                    "Content Creation",
                    "Social Media Management",
                    "Market Research",
                ],
                "Bán hàng": [
                    "Tư vấn khách hàng",
                    "Đàm phán",
                    "Quản lý khách hàng",
                    "Bán hàng trực tuyến",
                ],
                "Nhân sự": [
                    "Tuyển dụng",
                    "Đào tạo nhân viên",
                    "Quản lý lương thưởng",
                    "Xây dựng chính sách",
                ],
            };

            const commonSoftSkills = [
                "Kỹ năng giao tiếp",
                "Kỹ năng làm việc nhóm",
                "Kỹ năng giải quyết vấn đề",
                "Kỹ năng quản lý thời gian",
                "Tư duy logic và khả năng phân tích",
                "Khả năng học hỏi nhanh",
                "Tinh thần trách nhiệm cao",
            ];

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
                const randomLocation =
                    locations[
                        faker.datatype.number({
                            min: 0,
                            max: locations.length - 1,
                        })
                    ];
                const randomPosition =
                    positions[
                        faker.datatype.number({
                            min: 0,
                            max: positions.length - 1,
                        })
                    ];
                const randomCategory =
                    categories[
                        faker.datatype.number({
                            min: 0,
                            max: categories.length - 1,
                        })
                    ];

                // Chọn kỹ năng dựa trên category
                let candidateSkills = [];
                let professionalSkills = [];
                let objective = "";

                if (
                    randomCategory &&
                    skillsByCategory[randomCategory.category_name]
                ) {
                    const categorySkills =
                        skillsByCategory[randomCategory.category_name];
                    const numSkills = faker.datatype.number({ min: 2, max: 5 });
                    candidateSkills = faker.random.arrayElements(
                        categorySkills,
                        numSkills
                    );

                    // Professional skills
                    if (
                        professionalSkillsByCategory[
                            randomCategory.category_name
                        ]
                    ) {
                        professionalSkills =
                            professionalSkillsByCategory[
                                randomCategory.category_name
                            ];
                    }

                    // Career objective
                    if (careerObjectives[randomCategory.category_name]) {
                        objective = faker.random.arrayElement(
                            careerObjectives[randomCategory.category_name]
                        );
                    }
                } else {
                    // Kỹ năng chung nếu không có category phù hợp
                    const generalSkills = [
                        "Giao tiếp",
                        "Làm việc nhóm",
                        "Quản lý thời gian",
                        "Microsoft Office",
                        "Tiếng Anh",
                    ];
                    candidateSkills = faker.random.arrayElements(
                        generalSkills,
                        faker.datatype.number({ min: 2, max: 4 })
                    );
                    professionalSkills = ["Kỹ năng cơ bản", "Học hỏi nhanh"];
                    objective =
                        "Tôi mong muốn tìm được một môi trường làm việc chuyên nghiệp để phát triển kỹ năng và đóng góp cho sự thành công của công ty.";
                }

                mockCandidates.push({
                    full_name: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    address: faker.address.streetAddress(),
                    location_id: randomLocation ? randomLocation._id : null,
                    position_id: randomPosition ? randomPosition._id : null,
                    category_id: randomCategory ? randomCategory._id : null,
                    education: randomEducation ? randomEducation._id : null,
                    experience: randomExperience ? randomExperience._id : null,
                    skills: candidateSkills,
                    gender: faker.random.arrayElement(["Nam", "Nữ"]),
                    salary_expectation: faker.random.arrayElement(salaryRanges),
                    status: faker.random.arrayElement([
                        "active",
                        "active",
                        "active",
                        "inactive",
                    ]),
                    resume_file: faker.system.filePath(),
                    profile_picture: faker.image.avatar(),

                    // ✅ THÊM DỮ LIỆU CHO CÁC TRƯỜNG MỚI
                    birth_date: faker.date.between("1990-01-01", "2005-12-31"),
                    marital_status: faker.random.arrayElement([
                        "Độc thân",
                        "Đã kết hôn",
                    ]),
                    career_objective: objective,
                    work_preference: faker.random.arrayElement(workPreferences),
                    professional_skills: professionalSkills,
                    soft_skills: faker.random.arrayElements(
                        commonSoftSkills,
                        faker.datatype.number({ min: 3, max: 6 })
                    ),
                });
            });

            // ...existing code...

            // Chèn dữ liệu vào MongoDB sau khi tạo xong toàn bộ mock dữ liệu
            Candidate.insertMany(mockCandidates)
                .then(() => console.log("Mock candidates inserted"))
                .catch((err) =>
                    console.log("Error inserting candidates:", err)
                );
        })
        .catch((err) => {
            console.log("Error fetching reference data:", err);
        });
});
