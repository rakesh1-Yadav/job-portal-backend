const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, default: "Applied" }, // Applied, Shortlisted, Rejected
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
