const express = require("express");
const aiRouter = express.Router();
const { processAiFeedback } = require("../controllers/ai.controllers");

aiRouter.post("/feedback", processAiFeedback);

module.exports = aiRouter;
