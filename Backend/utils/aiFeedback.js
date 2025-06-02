const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getAiFeedback = async (transcript) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a feedback giver AI. Analyze the transcript of a interview meeting and ONLY give a score between 0 and 100. with 2 lines of feedback.`,
      },
      {
        role: "user",
        content: `transcript:\n${transcript}`,
      },
    ],
  });

  return response.choices[0].message.content.trim();
};

module.exports = {
  getAiFeedback,
};
