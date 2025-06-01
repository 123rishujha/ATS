const { ApplicationModel } = require("../models/application.model");
const { JobPostModel } = require("../models/jobpost.model");
const { getFitScore } = require("../utils/getFitScore");

// CREATE
const createApplication = async (req, res, next) => {
  try {
    // Only jobseekers can apply
    if (req.user.role !== "jobseeker") {
      return res
        .status(403)
        .json({ success: false, msg: "Only jobseekers can apply for jobs." });
    }
    const { jobId } = req.body;
    // Prevent duplicate applications
    const exists = await ApplicationModel.findOne({
      jobId,
      candidateId: req.user._id,
    });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, msg: "You have already applied to this job." });
    }
    // Check if job exists
    const job = await JobPostModel.findById(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, msg: "Job post not found." });
    }
    const application = new ApplicationModel({
      ...req.body,
      candidateId: req.user._id,
    });
    await application.save();
    // Increment applicantsCount for the job post
    await JobPostModel.findByIdAndUpdate(jobId, {
      $inc: { applicantsCount: 1 },
    });
    res.status(201).json({
      success: true,
      data: application,
      msg: "Application Sent Successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL (admin/recruiter sees all, jobseeker sees own)
const getAllApplications = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === "jobseeker") {
      query.candidateId = req.user._id;
    } else if (req.user.role === "recruiter") {
      // Recruiter sees applications for their jobs
      const jobs = await JobPostModel.find(
        { recruiterId: req.user._id },
        "_id"
      );
      query.jobId = { $in: jobs.map((j) => j._id) };
    }
    const applications = await ApplicationModel.find(query);
    res.json({
      success: true,
      data: applications,
      msg: "Applications Fetched Successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// GET ONE (candidate or recruiter of job)
const getApplicationById = async (req, res, next) => {
  try {
    const application = await ApplicationModel.findById(req.params.id);
    if (!application)
      return res
        .status(404)
        .json({ success: false, msg: "Application not found." });
    if (
      (req.user.role === "jobseeker" &&
        String(application.candidateId) !== String(req.user._id)) ||
      req.user.role === "recruiter"
    ) {
      // For recruiter, check if owns the job
      const job = await JobPostModel.findById(application.jobId);
      if (!job || String(job.recruiterId) !== String(req.user._id)) {
        return res.status(403).json({ success: false, msg: "Unauthorized." });
      }
    } else if (req.user.role !== "jobseeker" && req.user.role !== "recruiter") {
      return res.status(403).json({ success: false, msg: "Unauthorized." });
    }
    res.json({
      success: true,
      data: application,
      msg: "Application Fetched Successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE (candidate can withdraw, recruiter can update status/feedback/offer)
const updateApplication = async (req, res, next) => {
  try {
    const application = await ApplicationModel.findById(req.params.id);
    if (!application)
      return res
        .status(404)
        .json({ success: false, msg: "Application not found." });
    const job = await JobPostModel.findById(application.jobId);
    if (req.user.role === "jobseeker") {
      return res.status(403).json({ success: false, msg: "Unauthorized." });
    } else if (req.user.role === "recruiter") {
      if (!job || String(job.recruiterId) !== String(req.user._id)) {
        return res.status(403).json({ success: false, msg: "Unauthorized." });
      }
      // Recruiter can update status, interview, offerLetter, aiFitScore
      if (req.body.status) application.status = req.body.status;
      if (req.body.aiFitScore) application.aiFitScore = req.body.aiFitScore;
      if (req.body.interview)
        application.interview = {
          ...application.interview,
          ...req.body.interview,
        };
      if (req.body.offerLetter)
        application.offerLetter = {
          ...application.offerLetter,
          ...req.body.offerLetter,
        };
    } else {
      return res.status(403).json({ success: false, msg: "Unauthorized." });
    }
    await application.save();
    res.json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

const getApplicationMatchScore = async (req, res, next) => {
  const { resumeUrl, jobDescription } = req.body;

  try {
    const getScore = await getFitScore(resumeUrl, jobDescription);
    console.log("getScore", getScore);
    res.json({ success: true, data: getScore });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  getApplicationMatchScore,
};
