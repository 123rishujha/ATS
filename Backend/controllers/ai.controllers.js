const { getAiFeedback } = require("../utils/aiFeedback");

const processAiFeedback = async (req, res, next) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        success: false,
        msg: "Transcript is required in the request body.",
      });
    }

    // Call the AI feedback function
    const feedback = await getAiFeedback(transcript);

    res.status(200).json({
      success: true,
      data: feedback,
      msg: "AI feedback processed successfully.",
    });
  } catch (error) {
    console.error("Error processing AI feedback:", error);
    next(error); // Pass error to the error handling middleware
  }
};

module.exports = {
  processAiFeedback,
};
