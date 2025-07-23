const express = require("express");
const router = express.Router();
const Employer = require("../models/employerModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

router.post(
    "/upload-logo",
    authenticateToken,
    upload.single("logo"),
    async (req, res) => {
        try {
            if (req.user.role !== "employer") {
                return res.status(403).json({ message: "Access denied" });
            }

            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            // Tạo URL cho logo
            const logoUrl = `/uploads/logos/${req.file.filename}`;

            res.json({
                message: "Logo uploaded successfully",
                logoUrl: logoUrl,
            });
        } catch (error) {
            console.error("Error uploading logo:", error);
            res.status(500).json({ message: "Server error during upload" });
        }
    }
);

// GET /api/employer/profile - Lấy thông tin profile
router.get("/profile", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const employer = await Employer.findOne({
            $or: [{ user_id: req.user.id }, { email: user.email }],
        })
            .populate("location_id", "location_name")
            .populate("category_id", "category_name");

        if (!employer) {
            return res
                .status(404)
                .json({ message: "Employer profile not found" });
        }

        res.json(employer);
    } catch (error) {
        console.error("Error fetching employer profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT /api/employer/profile - Cập nhật thông tin profile
router.put("/profile", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const {
            employer_name,
            employer_description,
            contact_info,
            location_id,
            category_id,
            established_date,
            tax_code,
            company_size,
            business_license,
            phone,
            email,
            website,
            address,
            business_type,
            employer_logo,
        } = req.body;

        const updateData = {};

        if (employer_name !== undefined && employer_name !== null)
            updateData.employer_name = employer_name;
        if (employer_description !== undefined && employer_description !== null)
            updateData.employer_description = employer_description;
        if (contact_info !== undefined && contact_info !== null)
            updateData.contact_info = contact_info;
        if (location_id && location_id !== "" && location_id !== null)
            updateData.location_id = location_id;
        if (category_id && category_id !== "" && category_id !== null)
            updateData.category_id = category_id;
        if (established_date !== undefined && established_date !== null)
            updateData.established_date = established_date;
        if (tax_code !== undefined && tax_code !== null)
            updateData.tax_code = tax_code;
        if (company_size !== undefined && company_size !== null)
            updateData.company_size = company_size;
        if (business_license !== undefined && business_license !== null)
            updateData.business_license = business_license;
        if (phone !== undefined && phone !== null) updateData.phone = phone;
        if (email !== undefined && email !== null) updateData.email = email;
        if (website !== undefined && website !== null)
            updateData.website = website;
        if (address !== undefined && address !== null)
            updateData.address = address;
        if (business_type !== undefined && business_type !== null)
            updateData.business_type = business_type;
        if (employer_logo !== undefined && employer_logo !== null)
            updateData.employer_logo = employer_logo;

        console.log("Update data:", updateData);

        const updatedEmployer = await Employer.findOneAndUpdate(
            {
                $or: [{ user_id: req.user.id }, { email: user.email }],
            },
            updateData,
            { new: true, runValidators: false }
        )
            .populate("location_id", "location_name")
            .populate("category_id", "category_name");

        if (!updatedEmployer) {
            return res
                .status(404)
                .json({ message: "Employer profile not found" });
        }

        res.json(updatedEmployer);
    } catch (error) {
        console.error("Error updating employer profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
