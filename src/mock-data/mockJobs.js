const faker = require("faker");
const db = require("./db");
const Jobs = require("../models/jobModel");
const Employer = require("../models/employerModel");
const Category = require("../models/categoryModel");
const Location = require("../models/locationModel");
const Position = require("../models/positionModel");
const FormOfEmployment = require("../models/formOfEmploymentModel");
const Experience = require("../models/experienceModel");
const Education = require("../models/educationModel");

// Dữ liệu công việc doanh nghiệp Việt Nam
const vietnameseJobs = {
    IT: {
        titles: [
            "Lập trình viên Web",
            "Phát triển ứng dụng Mobile",
            "Chuyên viên IT",
            "Kỹ sư phần mềm",
            "Quản trị hệ thống",
        ],
        descriptions: [
            "Phát triển website thương mại điện tử",
            "Xây dựng ứng dụng mobile iOS/Android",
            "Bảo trì và vận hành hệ thống",
            "Phân tích yêu cầu và thiết kế hệ thống",
            "Kiểm thử phần mềm và đảm bảo chất lượng",
        ],
    },
    "Kế toán": {
        titles: [
            "Nhân viên kế toán",
            "Kế toán trưởng",
            "Chuyên viên thuế",
            "Kế toán tổng hợp",
            "Kế toán chi phí",
        ],
        descriptions: [
            "Lập báo cáo tài chính hàng tháng, quý, năm",
            "Quản lý thu chi và dòng tiền doanh nghiệp",
            "Khai báo thuế và làm việc với cơ quan thuế",
            "Kiểm soát chi phí và lập budget",
            "Quản lý tài sản và khấu hao",
        ],
    },
    Marketing: {
        titles: [
            "Nhân viên Marketing",
            "Chuyên viên Digital Marketing",
            "Content Creator",
            "Marketing Manager",
            "Social Media Specialist",
        ],
        descriptions: [
            "Xây dựng chiến lược marketing online",
            "Quản lý fanpage và mạng xã hội",
            "Sáng tạo nội dung và thiết kế",
            "Phân tích dữ liệu và báo cáo hiệu quả",
            "Tổ chức sự kiện và hoạt động PR",
        ],
    },
    "Bán hàng": {
        titles: [
            "Nhân viên bán hàng",
            "Tư vấn bán hàng",
            "Quản lý bán hàng",
            "Nhân viên kinh doanh",
            "Chuyên viên chăm sóc khách hàng",
        ],
        descriptions: [
            "Tư vấn sản phẩm cho khách hàng",
            "Xây dựng mối quan hệ với đối tác",
            "Thực hiện kế hoạch bán hàng",
            "Chăm sóc khách hàng sau bán hàng",
            "Báo cáo doanh số và phân tích thị trường",
        ],
    },
    "Nhân sự": {
        titles: [
            "Nhân viên nhân sự",
            "Chuyên viên tuyển dụng",
            "HR Manager",
            "Chuyên viên đào tạo",
            "Chuyên viên lương thưởng",
        ],
        descriptions: [
            "Tuyển dụng và phỏng vấn ứng viên",
            "Quản lý hồ sơ nhân viên",
            "Xây dựng chính sách nhân sự",
            "Tổ chức các khóa đào tạo",
            "Tính lương và quản lý phúc lợi",
        ],
    },
};

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
        "Git",
        "Docker",
    ],
    "Kế toán": [
        "Excel",
        "Misa",
        "Fast",
        "Luật thuế",
        "Phân tích tài chính",
        "Báo cáo tài chính",
        "Kế toán doanh nghiệp",
    ],
    Marketing: [
        "Google Ads",
        "Facebook Ads",
        "SEO",
        "Content Marketing",
        "Photoshop",
        "Canva",
        "Analytics",
        "Social Media",
    ],
    "Bán hàng": [
        "Tư vấn khách hàng",
        "Thương lượng",
        "CRM",
        "Kỹ năng giao tiếp",
        "Bán hàng online",
        "Chăm sóc khách hàng",
    ],
    "Nhân sự": [
        "Tuyển dụng",
        "Phỏng vấn",
        "Quản lý nhân sự",
        "Luật lao động",
        "Đào tạo",
        "Lương thưởng",
        "HR Software",
    ],
};

const benefits = [
    "Lương 13 tháng + thưởng theo hiệu quả công việc",
    "Bảo hiểm xã hội, y tế, thất nghiệp đầy đủ",
    "Khám sức khỏe định kỳ hàng năm",
    "Du lịch công ty hàng năm",
    "Đào tạo nâng cao kỹ năng chuyên môn",
    "Môi trường làm việc thân thiện, năng động",
    "Cơ hội thăng tiến và phát triển nghề nghiệp",
    "Chế độ nghỉ phép có lương 12 ngày/năm",
];

const documents = [
    "Đơn xin việc có photo",
    "Sơ yếu lý lịch có xác nhận",
    "Bản sao CMND/CCCD",
    "Bản sao bằng cấp, chứng chỉ",
    "Giấy khám sức khỏe",
    "Giấy xác nhận không có tiền án tiền sự",
];

// Tạo dữ liệu mock cho công việc (Job)
Employer.find({})
    .then((employers) => {
        Location.find({}).then((locations) => {
            Position.find({}).then((positions) => {
                FormOfEmployment.find({}).then((forms) => {
                    Experience.find({}).then((experiences) => {
                        Education.find({}).then((educations) => {
                            const mockJobs = [];

                            for (let i = 0; i < 30; i++) {
                                const randomEmployer =
                                    employers[
                                        faker.datatype.number({
                                            min: 0,
                                            max: employers.length - 1,
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
                                const randomForm =
                                    forms[
                                        faker.datatype.number({
                                            min: 0,
                                            max: forms.length - 1,
                                        })
                                    ];
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

                                // Chọn category ngẫu nhiên từ danh sách categories có sẵn
                                const categoryNames = Object.keys(vietnameseJobs);
                                const categoryName = faker.random.arrayElement(categoryNames);
                                const jobCategory = vietnameseJobs[categoryName];

                                // Tạo title và description phù hợp với category
                                const jobTitle = faker.random.arrayElement(
                                    jobCategory.titles
                                );
                                const mainDescription =
                                    faker.random.arrayElements(
                                        jobCategory.descriptions,
                                        faker.datatype.number({
                                            min: 3,
                                            max: 5,
                                        })
                                    );

                                // Tạo skills phù hợp
                                const jobSkills =
                                    skillsByCategory[categoryName] ||
                                    skillsByCategory["Bán hàng"];
                                const selectedSkills =
                                    faker.random.arrayElements(
                                        jobSkills,
                                        faker.datatype.number({
                                            min: 3,
                                            max: 6,
                                        })
                                    );

                                // Tạo mức lương realistic cho VN
                                const salaryRanges = [
                                    "8000000-12000000",
                                    "10000000-15000000",
                                    "12000000-18000000",
                                    "15000000-20000000",
                                    "18000000-25000000",
                                    "20000000-30000000",
                                    "5000000-8000000",
                                    "25000000-35000000",
                                ];
                                const salaryRange =
                                    faker.random.arrayElement(salaryRanges);

                                // Tạo job_description chi tiết
                                const jobDescription = {
                                    basic_info: {
                                        quantity: faker.datatype.number({
                                            min: 1,
                                            max: 10,
                                        }),
                                        work_type:
                                            randomForm.form_name ||
                                            "Toàn thời gian",
                                        salary_type: "Lương cố định + thưởng",
                                    },
                                    job_details: {
                                        position: jobTitle.toUpperCase(),
                                        workplace: `${randomLocation.location_name} và các khu vực lân cận`,
                                        description: mainDescription,
                                    },
                                    requirements: {
                                        work_experience: [
                                            `Có kinh nghiệm ${randomExperience.experience_level.toLowerCase()}`,
                                            `Trình độ tối thiểu ${randomEducation.education_level}`,
                                            "Có khả năng làm việc độc lập và theo nhóm",
                                            "Chịu được áp lực công việc cao",
                                        ],
                                        professional_skills: selectedSkills,
                                        soft_skills: [
                                            "Kỹ năng giao tiếp tốt",
                                            "Kỹ năng làm việc nhóm",
                                            "Tư duy logic và sáng tạo",
                                            "Khả năng học hỏi nhanh",
                                        ],
                                        language: faker.random.boolean()
                                            ? ["Tiếng Anh giao tiếp"]
                                            : ["Không yêu cầu ngoại ngữ"],
                                    },
                                    benefits: {
                                        insurance: faker.random.arrayElements(
                                            benefits,
                                            faker.datatype.number({
                                                min: 4,
                                                max: 6,
                                            })
                                        ),
                                    },
                                    documents: faker.random.arrayElements(
                                        documents,
                                        faker.datatype.number({
                                            min: 4,
                                            max: 6,
                                        })
                                    ),
                                    contact_info: {
                                        province: randomLocation.location_name,
                                        district: faker.address.county(),
                                        ward: faker.address.streetName(),
                                        address: `${faker.address.streetAddress()}, ${
                                            randomLocation.location_name
                                        }`,
                                        phone: `0${faker.datatype.number({
                                            min: 900000000,
                                            max: 999999999,
                                        })}`,
                                        email:
                                            randomEmployer.contact_info ||
                                            `hr@${randomEmployer.employer_name
                                                .toLowerCase()
                                                .replace(/\s+/g, "")}.com.vn`,
                                        website: `https://${randomEmployer.employer_name
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")}.com.vn`,
                                    },
                                };

                                mockJobs.push({
                                    title: jobTitle,
                                    employer_id: randomEmployer._id,
                                    location_id: randomLocation._id,
                                    position_id: randomPosition._id,
                                    experience_id: randomExperience._id,
                                    education_id: randomEducation._id,
                                    form_of_employment_id: randomForm._id,
                                    salary_range: salaryRange,
                                    quantity:
                                        jobDescription.basic_info.quantity,
                                    job_description: jobDescription,
                                    posted_at: faker.date.past(),
                                    expiration_date: faker.date.future(),
                                    status: "active",
                                });
                            }

                            Jobs.insertMany(mockJobs)
                                .then(async () => {
                                    console.log("Mock jobs inserted");

                                    // Cập nhật num_job cho mỗi employer
                                    for (const employer of employers) {
                                        const jobCount =
                                            await Jobs.countDocuments({
                                                employer_id: employer._id,
                                            });
                                        await Employer.findByIdAndUpdate(
                                            employer._id,
                                            { num_job: jobCount }
                                        );
                                    }
                                    console.log("Employer job counts updated");
                                })
                                .catch((err) =>
                                    console.log("Error inserting jobs:", err)
                                );
                        });
                    });
                });
            });
        });
    });
