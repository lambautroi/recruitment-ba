const express = require("express");
const router = express.Router();
const Employer = require("../models/employerModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
        (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            req.user = user;
            next();
        }
    );
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/logos";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "logo-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)"));
        }
    },
});

// Upload logo route với auth middleware
router.post("/upload-logo", auth, upload.single("logo"), async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Access denied" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        if (req.file.size > 2 * 1024 * 1024) {
            return res
                .status(400)
                .json({ message: "File size too large (max 2MB)" });
        }

        const logoUrl = `/uploads/logos/${req.file.filename}`;

        res.json({
            message: "Logo uploaded successfully",
            logoUrl: logoUrl,
        });
    } catch (error) {
        console.error("Error uploading logo:", error);
        res.status(500).json({
            message: "Server error during upload",
            error: error.message,
        });
    }
});

// GET /api/employer/profile - Lấy thông tin profile
router.get("/profile", auth, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const employer = await Employer.findOne({
            email: req.user.email,
        })
            .populate("location_id", "location_name")
            .populate("category_id", "category_name");

        if (!employer) {
            console.log("Creating new employer for email:", req.user.email);

            const newEmployer = new Employer({
                email: req.user.email,
                employer_name: req.user.fullName || req.user.full_name || "",
                phone: "",
            });

            const savedEmployer = await newEmployer.save();
            console.log("New employer created:", savedEmployer);
            return res.json(savedEmployer);
        }

        console.log("Found existing employer:", employer);
        res.json(employer);
    } catch (error) {
        console.error("Error fetching employer profile:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message,
            stack: error.stack,
        });
    }
});

// PUT /api/employer/profile - Cập nhật thông tin profile
router.put("/profile", auth, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Access denied" });
        }
        const updateData = {};

        const allowedFields = [
            "employer_name",
            "employer_description",
            "contact_info",
            "location_id",
            "category_id",
            "established_date",
            "tax_code",
            "company_size",
            "business_license",
            "phone",
            "email",
            "website",
            "address",
            "industry",
            "business_type",
            "employer_logo",
        ];

        allowedFields.forEach((field) => {
            const value = req.body[field];
            if (value !== "" && value !== null && value !== undefined) {
                if (typeof value === "string") {
                    updateData[field] = value.trim();
                } else {
                    updateData[field] = value;
                }
            }
        });

        const employer = await Employer.findOneAndUpdate(
            { email: req.user.email },
            {
                ...updateData,
                updated_at: new Date(),
            },
            {
                new: true,
                runValidators: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }
        )
            .populate("location_id", "location_name")
            .populate("category_id", "category_name");

        res.json({
            message: "Profile updated successfully",
            employer,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation error",
                error: error.message,
                details: error.errors,
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists in system",
                error: "Duplicate email",
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;
