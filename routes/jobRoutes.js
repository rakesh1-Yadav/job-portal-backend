const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// @desc    Get all jobs
// @route   GET /jobs
// @access  Public
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// @desc    Create a new job
// @route   POST /jobs
// @access  Public (You can later add auth middleware)
router.post("/", async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }

    const newJob = new Job({
      title,
      company,
      location,
      description,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// @desc    Get a single job by ID
// @route   GET /jobs/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// @desc    Update a job
// @route   PUT /jobs/:id
// @access  Public (Add auth later if needed)
router.put("/:id", async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { title, company, location, description },
      { new: true }
    );

    if (!updatedJob) return res.status(404).json({ msg: "Job not found" });

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// @desc    Delete a job
// @route   DELETE /jobs/:id
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ msg: "Job not found" });

    res.json({ msg: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
