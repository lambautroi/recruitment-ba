const faker = require("faker");
const db = require("./db");
const Employer = require("../models/employerModel");
const User = require("../models/userModel");
const Location = require("../models/locationModel");

// Lấy các người dùng có role là 'employer'
Promise.all([User.find({ role: "employer" }), Location.find({})]).then(
    ([users, locations]) => {
        if (users.length === 0 || locations.length === 0) {
            console.log(
                "No employers or locations found. Please insert first."
            );
            return;
        }

        const mockEmployers = users.map((user) => {
            const randomLocation =
                locations[
                    faker.datatype.number({ min: 0, max: locations.length - 1 })
                ];
            return {
                employer_name: user.fullName,
                employer_logo: faker.image.imageUrl(),
                employer_description: faker.company.catchPhrase(),
                contact_info: faker.phone.phoneNumber(),
                location_id: randomLocation ? randomLocation._id : null,
            };
        });

        Employer.insertMany(mockEmployers)
            .then(() => console.log("Mock employers inserted"))
            .catch((err) => console.log("Error inserting employers:", err));
    }
);
