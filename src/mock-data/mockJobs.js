const faker = require("faker");
const db = require("./db"); // Kết nối MongoDB
const Job = require("../models/jobModel");
const Employer = require("../models/employerModel");
const Category = require("../models/categoryModel");
const Location = require("../models/locationModel");

const mockJobs = [];

Promise.all([Employer.find({}), Category.find({}), Location.find({})]).then(
    ([employers, categories, locations]) => {
        if (
            employers.length === 0 ||
            categories.length === 0 ||
            locations.length === 0
        ) {
            console.log(
                "Thiếu dữ liệu employer, category hoặc location. Hãy insert trước!"
            );
            return;
        }

        for (let i = 0; i < 30; i++) {
            const randomEmployer =
                employers[
                    faker.datatype.number({ min: 0, max: employers.length - 1 })
                ];
            const randomCategory =
                categories[
                    faker.datatype.number({
                        min: 0,
                        max: categories.length - 1,
                    })
                ];
            const randomLocation =
                locations[
                    faker.datatype.number({ min: 0, max: locations.length - 1 })
                ];

            mockJobs.push({
                title: faker.name.jobTitle(),
                employer_id: randomEmployer._id,
                category_id: randomCategory._id,
                location_id: randomLocation._id,
                salary_range: `${faker.datatype.number({
                    min: 10,
                    max: 30,
                })} triệu`,
                job_description: faker.lorem.sentences(),
                posted_at: faker.date.past(),
                expiration_date: faker.date.future(),
                status: "active",
            });
        }

        Job.insertMany(mockJobs)
            .then(() => console.log("Mock jobs inserted"))
            .catch((err) => console.log("Error inserting jobs:", err));
    }
);
