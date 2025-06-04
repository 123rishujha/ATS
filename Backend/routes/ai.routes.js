const express = require("express");
const aiRouter = express.Router();
const {
  processAiFeedback,
  chatWithCandidate,
} = require("../controllers/ai.controllers");

aiRouter.post("/feedback", processAiFeedback);
aiRouter.post("/chat/candidate/:applicationId", chatWithCandidate);

module.exports = aiRouter;
