const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Nạp các biến môi trường từ file .env

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

app.listen(3001, () => console.log("Server running on port 3001"));
