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
        Category.find({})
    ]).then(([experiences, educations, locations, positions, categories]) => {
        
        // Danh sách kỹ năng mẫu theo ngành nghề
        const skillsByCategory = {
            "IT": ["HTML", "CSS", "JavaScript", "ReactJS", "NodeJS", "Python", "Laravel", "PHP", "MySQL", "MongoDB"],
            "Kế toán": ["Tính toán lương", "Tính toán số sách", "Excel", "Kế toán doanh nghiệp", "Báo cáo tài chính"],
            "Marketing": ["Social Media", "Google Ads", "Facebook Ads", "Content Marketing", "SEO", "Photoshop"],
            "Nhân sự": ["Tuyển dụng", "Quản lý nhân sự", "Đào tạo", "Lương thưởng", "Luật lao động"],
            "Bán hàng": ["Tư vấn khách hàng", "Thương lượng", "Chăm sóc khách hàng", "Bán hàng online"]
        };

        // Mức lương mong muốn
        const salaryRanges = [
            "3 - 5 triệu",
            "5 - 7 triệu", 
            "7 - 10 triệu",
            "10 - 15 triệu",
            "15 - 20 triệu",
            "Trên 20 triệu",
            "Thỏa thuận"
        ];

        users.forEach((user) => {
            const randomExperience = experiences[faker.datatype.number({ min: 0, max: experiences.length - 1 })];
            const randomEducation = educations[faker.datatype.number({ min: 0, max: educations.length - 1 })];
            const randomLocation = locations[faker.datatype.number({ min: 0, max: locations.length - 1 })];
            const randomPosition = positions[faker.datatype.number({ min: 0, max: positions.length - 1 })];
            const randomCategory = categories[faker.datatype.number({ min: 0, max: categories.length - 1 })];
            
            // Chọn kỹ năng dựa trên category
            let candidateSkills = [];
            if (randomCategory && skillsByCategory[randomCategory.category_name]) {
                const categorySkills = skillsByCategory[randomCategory.category_name];
                const numSkills = faker.datatype.number({ min: 2, max: 5 });
                candidateSkills = faker.random.arrayElements(categorySkills, numSkills);
            } else {
                // Kỹ năng chung nếu không có category phù hợp
                const generalSkills = ["Giao tiếp", "Làm việc nhóm", "Quản lý thời gian", "Microsoft Office", "Tiếng Anh"];
                candidateSkills = faker.random.arrayElements(generalSkills, faker.datatype.number({ min: 2, max: 4 }));
            }

            mockCandidates.push({
                full_name: user.fullName,
                email: user.email,
                phone: user.phone,
                address: faker.address.streetAddress(), // Địa chỉ chi tiết
                location_id: randomLocation ? randomLocation._id : null, // Tỉnh/Thành phố
                position_id: randomPosition ? randomPosition._id : null, // Cấp bậc/Chức vụ
                category_id: randomCategory ? randomCategory._id : null, // Danh mục nghề nghiệp
                education: randomEducation ? randomEducation._id : null, // Trình độ học vấn
                experience: randomExperience ? randomExperience._id : null, // Kinh nghiệm làm việc
                skills: candidateSkills, // Kỹ năng
                gender: faker.random.arrayElement(["Nam", "Nữ"]), // Giới tính
                salary_expectation: faker.random.arrayElement(salaryRanges), // Mức lương mong muốn
                status: faker.random.arrayElement(["active", "active", "active", "inactive"]), // 75% active
                resume_file: faker.system.filePath(), // Đường dẫn file CV
                profile_picture: faker.image.avatar(), // Ảnh đại diện
            });
        });

        // Chèn dữ liệu vào MongoDB sau khi tạo xong toàn bộ mock dữ liệu
        Candidate.insertMany(mockCandidates)
            .then(() => console.log("Mock candidates inserted"))
            .catch((err) => console.log("Error inserting candidates:", err));
    }).catch((err) => {
        console.log("Error fetching reference data:", err);
    });
});
