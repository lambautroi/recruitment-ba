const faker = require("faker");
const db = require("./db");
const Employer = require("../models/employerModel");
const User = require("../models/userModel");
const Location = require("../models/locationModel");
const Category = require("../models/categoryModel");

Promise.all([
    User.find({ role: "employer" }),
    Location.find({}),
    Category.find({}),
]).then(([users, locations, categories]) => {
    if (
        users.length === 0 ||
        locations.length === 0 ||
        categories.length === 0
    ) {
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
            employer_logo: faker.image.business(),
            employer_description:
                faker.company.catchPhrase() + ". " + faker.lorem.sentences(3),
            contact_info: faker.phone.phoneNumber(),
            location_id: randomLocation ? randomLocation._id : null,
            category_id: randomCategory ? randomCategory._id : null,
            num_job: 0,
            established_date: faker.date.between("2000-01-01", "2020-12-31"),
            tax_code: faker.datatype
                .number({ min: 1000000000, max: 9999999999 })
                .toString(),
            company_size: faker.random.arrayElement([
                "Dưới 50 nhân viên",
                "50-100 nhân viên",
                "100-500 nhân viên",
                "Trên 500 nhân viên",
            ]),
            business_license:
                "Giấy phép kinh doanh số " +
                faker.datatype.number({ min: 100000, max: 999999 }),
            phone: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            website: faker.internet.url(),
            address:
                faker.address.streetAddress() + ", " + faker.address.city(),
            industry: randomCategory?.category_name || "Công nghệ thông tin",
            business_type: faker.random.arrayElement([
                "Công ty TNHH",
                "Công ty cổ phần",
                "Doanh nghiệp tư nhân",
            ]),
        };
    });

    Employer.insertMany(mockEmployers)
        .then(() => console.log("Mock employers inserted"))
        .catch((err) => console.log("Error inserting employers:", err));
});
