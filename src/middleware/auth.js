const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res
                .status(401)
                .json({ message: "Không có token, truy cập bị từ chối" });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your-secret-key"
        );

        const user = await User.findById(decoded.id);
        if (!user) {
            return res
                .status(401)
                .json({ message: "Token không hợp lệ - user không tồn tại" });
        }

        req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
        };

        next();
    } catch (error) {
        console.error("❌ Auth middleware error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token đã hết hạn" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token không hợp lệ" });
        }

        res.status(401).json({ message: "Lỗi xác thực", error: error.message });
    }
};

module.exports = auth;
