const faker = require("faker");
const db = require("./db");
const Employer = require("../models/employerModel");
const User = require("../models/userModel");
const Location = require("../models/locationModel");
const Category = require("../models/categoryModel");

// Lấy các người dùng có role là 'employer'
Promise.all([
    User.find({ role: "employer" }),
    Location.find({}),
    Category.find({})
]).then(([users, locations, categories]) => {
    if (users.length === 0 || locations.length === 0 || categories.length === 0) {
        console.log(
            "No employers, locations, or categories found. Please insert first."
        );
        return;
    }

    const mockEmployers = users.map((user) => {
        const randomLocation =
            locations[
                faker.datatype.number({ min: 0, max: locations.length - 1 })
            ];
        const randomCategory =
            categories[
                faker.datatype.number({ min: 0, max: categories.length - 1 })
            ];
        return {
            employer_name: user.fullName,
            employer_logo: faker.image.imageUrl(),
            employer_description: faker.company.catchPhrase(),
            contact_info: faker.phone.phoneNumber(),
            location_id: randomLocation ? randomLocation._id : null,
            category_id: randomCategory ? randomCategory._id : null,
            num_job: 0, // Sẽ được cập nhật sau khi tạo jobs
        };
    });

    Employer.insertMany(mockEmployers)
        .then(() => console.log("Mock employers inserted"))
        .catch((err) => console.log("Error inserting employers:", err));
});
