const express = require("express");
const dashboardRouter = express.Router();
const {
  getRecruiterDashboard,
} = require("../controllers/dashboard.controllers");
const { authMiddleware } = require("../middlewares/authMiddleware");

dashboardRouter.get("/recruiter", authMiddleware, getRecruiterDashboard);

module.exports = dashboardRouter;
