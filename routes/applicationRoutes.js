const express = require("express");
const Application = require("../models/Application");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Apply to a job (user comes from token, not body)
router.post("/:jobId/apply", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    // Prevent duplicate
    const exists = await Application.findOne({ job: jobId, user: userId });
    if (exists) return res.status(400).json({ message: "You already applied" });

    const newApp = new Application({ job: jobId, user: userId });
    await newApp.save();

    res.json({ message: "✅ Application submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Failed to apply" });
  }
});

// Get my applications
router.get("/me", auth, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id }).populate("job");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch applications" });
  }
});

module.exports = router;
