const { ApplicationModel } = require("../models/application.model");
const { EmbeddingModel } = require("../models/embedding.model");
const { getAiFeedback } = require("../utils/aiFeedback");

const { OpenAI } = require("openai");
const { cosineSimilarity } = require("../utils/cosineSimilarity");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const chatWithCandidate = async (req, res, next) => {
  try {
    const { query } = req.body;
    const { applicationId } = req.params;

    // Step 1: Create embedding of user's query
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const queryEmbedding = embeddingRes.data[0].embedding;

    // Step 2: Find the embedding for this specific application
    const embeddingDoc = await EmbeddingModel.findOne({
      entityType: "application",
      sourceId: applicationId,
    });

    if (!embeddingDoc) {
      return res.status(404).json({
        success: false,
        message: "Embedding not found for this application.",
      });
    }

    // Step 3: Calculate similarity
    const cosineSimilarity = (a, b) => {
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dot / (magA * magB);
    };

    const score = cosineSimilarity(queryEmbedding, embeddingDoc.embedding);

    // Step 4: Use GPT to answer the query using the matched text
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant helping recruiters analyze candidate applications. Use the given context to answer questions.",
        },
        {
          role: "user",
          content: `Query: ${query}\n\nApplication Context:\n${embeddingDoc.text}`,
        },
      ],
    });

    return res.json({
      success: true,
      answer: completion.choices[0].message.content,
      score: score.toFixed(3),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const globalAiChat = async (req, res, next) => {
  try {
    const { query } = req.body;
    const { jobPostId } = req.params;

    const queryEmbedding = (
      await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
      })
    ).data[0].embedding;

    const applications = await ApplicationModel.find({ jobId: jobPostId });

    const appIdList = applications.map((app) => app._id.toString());

    const embeddings = await EmbeddingModel.find({
      entityType: "application",
      sourceId: { $in: appIdList },
    });

    if (!embeddings.length)
      return res
        .status(404)
        .json({ success: false, msg: "No embeddings found." });

    const results = embeddings.map((doc) => {
      const score = cosineSimilarity(queryEmbedding, doc.embedding);
      return { score, text: doc.text };
    });

    const topK = results.sort((a, b) => b.score - a.score).slice(0, 5); // No filtering

    const contextText = topK.map((r) => r.text).join("\n\n---\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant helping recruiters analyze candidate applications. ONLY use the given data. DO NOT assume anything outside the data.`,
        },
        {
          role: "user",
          content: `Here are top relevant candidate application data:\n\n${contextText}\n\nNow answer this query:\n"${query}"\n\nIf no candidate matches based on the visible data (not logic), clearly say: "No candidates matched your query based on available application data."`,
        },
      ],
    });

    const answer = completion.choices[0].message.content;

    res.status(200).json({ success: true, answer });
  } catch (err) {
    console.error("Global AI Chat error:", err);
    next(err);
  }
};

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
  chatWithCandidate,
  processAiFeedback,
  globalAiChat,
};
