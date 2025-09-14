const express = require("express");
const Application = require("../models/Application");
const router = express.Router();

// Apply to a job
router.post("/:jobId/apply", async (req, res) => {
  try {
    const { userId } = req.body;
    const { jobId } = req.params;

    const newApp = new Application({ job: jobId, user: userId });
    await newApp.save();

    res.json({ message: "✅ Application submitted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to apply" });
  }
});

// Get applications by user
router.get("/user/:userId", async (req, res) => {
  try {
    const apps = await Application.find({ user: req.params.userId }).populate("job");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch applications" });
  }
});

module.exports = router;
