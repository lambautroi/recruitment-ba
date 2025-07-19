const faker = require("faker");
const db = require("./db");
const Jobs = require("../models/jobModel");
const Employer = require("../models/employerModel");
const Location = require("../models/locationModel");
const Position = require("../models/positionModel");
const FormOfEmployment = require("../models/formOfEmploymentModel");
const Experience = require("../models/experienceModel");
const Education = require("../models/educationModel");

// Tạo dữ liệu mock cho công việc (Job)
Employer.find({}).then((employers) => {
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

                            const minSalary = 5000000;
                            const maxSalary = 25000000;
                            const step = 500000;
                            const steps = (maxSalary - minSalary) / step;
                            const randomStep = Math.floor(
                                Math.random() * (steps + 1)
                            );
                            const salaryAmount = minSalary + randomStep * step;

                            mockJobs.push({
                                title: faker.name.jobTitle(),
                                employer_id: randomEmployer._id,
                                location_id: randomLocation._id,
                                position_id: randomPosition._id,
                                experience_id: randomExperience._id,
                                education_id: randomEducation._id,
                                form_of_employment_id: randomForm._id,
                                salary_range: salaryAmount.toString(),
                                job_description: faker.lorem.sentences(),
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
                                    const jobCount = await Jobs.countDocuments({
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
