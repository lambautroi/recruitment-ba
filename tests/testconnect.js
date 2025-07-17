const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/testdb";

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ Kết nối MongoDB thành công!");
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error("❌ Kết nối MongoDB thất bại:", MONGO_URI, err.message);
        process.exit(1);
    });
