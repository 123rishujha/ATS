const express = require("express");
const aiRouter = express.Router();
const {
  processAiFeedback,
  chatWithCandidate,
  globalAiChat
} = require("../controllers/ai.controllers");

aiRouter.post("/feedback", processAiFeedback);
aiRouter.post("/chat/candidate/:applicationId", chatWithCandidate);
aiRouter.post("/chat/global/:jobPostId", globalAiChat);

module.exports = aiRouter;
