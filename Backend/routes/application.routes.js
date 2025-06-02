const express = require("express");
const applicationRouter = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  getApplicationMatchScore,
  getApplicationsByJobId,
  getApplicationByJobAndCandidateId,
  jobseekerAccpet_rejectApplication,
} = require("../controllers/application.controllers");

applicationRouter.use(authMiddleware);

// CREATE
applicationRouter.post("/", createApplication);
// READ ALL
applicationRouter.get("/", getAllApplications);
// READ ONE
applicationRouter.get("/:id", getApplicationById);
// UPDATE
applicationRouter.put("/:id", updateApplication);

applicationRouter.post("/fit-score", getApplicationMatchScore);

applicationRouter.put("/accept-reject/:id", jobseekerAccpet_rejectApplication);

// Get applications by jobId (recruiter only)
applicationRouter.post("/by-job", getApplicationsByJobId);

// GET SINGLE application by jobId and candidateId (recruiter/jobseeker)
applicationRouter.get(
  "/job/:jobId/candidate/:candidateId",
  getApplicationByJobAndCandidateId
);

module.exports = { applicationRouter };
