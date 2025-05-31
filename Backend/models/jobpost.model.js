const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  jobType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "remote", "hybrid"],
    default: "full-time",
  },

  salaryRange: {
    min: Number,
    max: Number,
  },

  requiredSkills: [String], // e.g. ['React', 'Node.js', 'MongoDB']

  experienceRequired: {
    min: Number, // in years
    max: Number,
  },

  isPublished: {
    type: Boolean,
    default: true,
  },

  applicantsCount: {
    type: Number,
    default: 0,
  },
});

const JobPostModel = mongoose.model("JobPost", jobSchema);

module.exports = { JobPostModel };
