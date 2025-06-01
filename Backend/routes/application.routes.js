const express = require("express");
const applicationRouter = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  getApplicationMatchScore,
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

module.exports = { applicationRouter };
