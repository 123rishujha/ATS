const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getTextEmbedding = async (text) => {
  console.log("ttttt inside ai", text);

  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  return response.data[0].embedding;
};

module.exports = { getTextEmbedding };
