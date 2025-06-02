const OpenAI = require("openai");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function downloadResume(url) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer",
  });

  const filePath = path.join(__dirname, "temp_resume.pdf");
  fs.writeFileSync(filePath, response.data);
  return filePath;
}

async function extractTextFromPDF(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
}

const getFitScore = async (resumeUrl, jobDescription) => {
  if (process.env.ENVIRONMENT === "local") {
    return 70;
  }
  const filePath = await downloadResume(resumeUrl);
  const resumeText = await extractTextFromPDF(filePath);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a resume matcher AI. Analyze the resume and job description and return ONLY a fit score between 0 and 100. Do not provide any explanation, reasoning, or additional text.`,
      },
      {
        role: "user",
        content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}\n\nOnly return a number between 0 and 100.`,
      },
    ],
  });

  fs.unlinkSync(filePath);
  const raw = response.choices[0].message.content.trim();
  const score = parseInt(raw.match(/\d+/)?.[0] || "0", 10);

  return score;
};

module.exports = { getFitScore };
