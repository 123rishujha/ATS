const express = require("express");
const dashboardRouter = express.Router();
const {
  getRecruiterDashboard,
  getJobSeekerDashboard,
} = require("../controllers/dashboard.controllers");
const { authMiddleware } = require("../middlewares/authMiddleware");

dashboardRouter.get("/recruiter", authMiddleware, getRecruiterDashboard);
dashboardRouter.get("/jobseeker", authMiddleware, getJobSeekerDashboard);

module.exports = dashboardRouter;
