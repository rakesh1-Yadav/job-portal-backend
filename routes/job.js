const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const jwt = require("jsonwebtoken");

// Middleware: verify token
function authMiddleware(req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
}

// Post a Job (Recruiter only)
router.post("/post", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can post jobs" });
        }

        const { title, company, location, description } = req.body;

        const job = new Job({
            title,
            company,
            location,
            description,
            postedBy: req.user.id,
        });

        await job.save();
        res.status(201).json({ message: "Job posted successfully", job });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all Jobs (Anyone can see)
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find().populate("postedBy", "name email");
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
