const { JobPostModel } = require("../models/jobpost.model");

// CREATE
const createJobPost = async (req, res, next) => {
  try {
    // Only recruiters can create job posts
    if (!req.user || req.user.role !== "recruiter") {
      return res
        .status(403)
        .json({ success: false, msg: "Only recruiters can create job posts" });
    }
    // Set recruiterId from authenticated user
    const jobPost = new JobPostModel({
      ...req.body,
      recruiterId: req.user._id,
    });
    await jobPost.save();
    res.status(201).json({ success: true, data: jobPost });
  } catch (err) {
    next(err);
  }
};

// READ ALL
const getAllJobPosts = async (req, res, next) => {
  try {
    const jobPosts = await JobPostModel.find({ isPublished: true });
    res.json({ success: true, data: jobPosts });
  } catch (err) {
    next(err);
  }
};

// READ Only Recruiter ALL
const getRecruiterJobPosts = async (req, res, next) => {
  try {
    const jobPosts = await JobPostModel.find({ recruiterId: req.user._id });
    res.json({ success: true, data: jobPosts });
  } catch (err) {
    next(err);
  }
};

// READ ONE
const getJobPostById = async (req, res, next) => {
  try {
    const jobPost = await JobPostModel.findById(req.params.id).populate({
      // path: "jobId",
      // select:
      //   "title company location jobType salaryRange experienceRequired description requirements recruiterId",
      // populate: {
      //   path: "recruiterId",
      //   select: "name email company",
      // },
      path: "recruiterId",
      select: "name email company",
    });
    if (!jobPost)
      return res
        .status(404)
        .json({ success: false, msg: "Job post not found" });
    res.json({ success: true, data: jobPost });
  } catch (err) {
    next(err);
  }
};

// UPDATE
const updateJobPost = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };
    if (req.user.role === "recruiter") {
      query.recruiterId = req.user._id;
    }
    const jobPost = await JobPostModel.findOne(query);
    if (!jobPost)
      return res
        .status(404)
        .json({ success: false, msg: "Job post not found or unauthorized" });
    Object.assign(jobPost, req.body);
    await jobPost.save();
    res.json({ success: true, data: jobPost });
  } catch (err) {
    next(err);
  }
};

// DELETE
const deleteJobPost = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };
    if (req.user.role === "recruiter") {
      query.recruiterId = req.user._id;
    }
    const jobPost = await JobPostModel.findOne(query);
    if (!jobPost)
      return res
        .status(404)
        .json({ success: false, msg: "Job post not found or unauthorized" });
    await jobPost.deleteOne();
    res.json({ success: true, msg: "Job post deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
  getRecruiterJobPosts,
};
