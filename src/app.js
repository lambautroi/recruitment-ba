const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối với MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error: ", err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api", require("./routes/homepage"));
app.use("/api", require("./routes/category"));
app.use("/api", require("./routes/jobNews"));
app.use("/api/jobs", require("./routes/jobpage"));
app.use("/api/companies", require("./routes/companypage"));
app.use("/api/candidates", require("./routes/candidatepage"));
app.use("/api/employer/jobs", require("./routes/employerJobs"));
app.use("/api/employer", require("./routes/employerProfile"));
app.use("/api/categories", require("./routes/modelRoute/categories"));
app.use("/api/locations", require("./routes/modelRoute/locations"));
app.use("/api/positions", require("./routes/modelRoute/positions"));
app.use("/api/experiences", require("./routes/modelRoute/experiences"));
app.use("/api/educations", require("./routes/modelRoute/educations"));
app.use(
    "/api/form-of-employments",
    require("./routes/modelRoute/formOfEmployments")
);
app.use("/uploads", express.static("uploads"));
app.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.listen(3001, () => console.log("Server running on port 3001"));
