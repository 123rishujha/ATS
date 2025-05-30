const express = require('express');
const jobPostRouter = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
  getRecruiterJobPosts,
} = require('../controllers/jobpost.controllers');

// Apply authMiddleware to all routes

jobPostRouter.use(authMiddleware);

// CREATE
jobPostRouter.post('/', createJobPost);
// READ ALL
jobPostRouter.get('/', getAllJobPosts);
// READ recruiter job posts
jobPostRouter.get('/recruiter-job-posts', getRecruiterJobPosts);
// READ ONE
jobPostRouter.get('/:id', getJobPostById);
// UPDATE
jobPostRouter.put('/:id', updateJobPost);
// DELETE
jobPostRouter.delete('/:id', deleteJobPost);

module.exports = { jobPostRouter };
