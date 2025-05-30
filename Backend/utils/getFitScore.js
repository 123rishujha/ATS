const OpenAI = require("openai");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function downloadResume(url) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
    });

    const filePath = path.join(__dirname, 'temp_resume.pdf');
    fs.writeFileSync(filePath, response.data);
    return filePath;
}

async function extractTextFromPDF(filePath) {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
}

const getFitScore = async (resumeUrl, jobDescription) => {
    const filePath = await downloadResume(resumeUrl);
    const resumeText = await extractTextFromPDF(filePath);

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `You are a resume matcher AI. Your task is to analyze the resume and job description and return a fit score between 0 and 100. The fit score is based on how well the resume matches the job description. The higher the fit score, the better the match.`,
            },
            {
                role: "user",
                content: `Resume: ${resumeText}\nJob Description: ${jobDescription}`,
            },
        ],
    });
    
    fs.unlinkSync(filePath);

    return response.choices[0].message.content;
};

module.exports = { getFitScore };
