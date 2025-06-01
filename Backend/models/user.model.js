const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userPhoto: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["recruiter", "jobseeker"],
      default: "jobseeker",
      required: true,
    },

    // Recruiter-specific
    company: {
      name: { type: String },
      website: { type: String },
      location: { type: String },
      description: { type: String },
    },

    // Jobseeker-specific
    resume: {
      url: { type: String }, // resume file path or S3 URL
      uploadedAt: { type: Date },
    },

    jobPreferences: {
      roles: [String],
      salaryExpectation: { type: Number },
      locationPreference: { type: String },
      remotePreferred: { type: Boolean },
      noticePeriod: { type: String }, // e.g., "Immediate", "15 days", etc.
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
