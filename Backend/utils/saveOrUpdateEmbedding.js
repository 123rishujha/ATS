// utils/saveOrUpdateEmbedding.js

const { EmbeddingModel } = require("../models/embedding.model");
const { getTextEmbedding } = require("./getTextEmbedding");

const saveOrUpdateEmbedding = async ({ entityType, sourceId, text }) => {
  // console.log("ttttt inside model", text);
  const embedding = await getTextEmbedding(text);

  // console.log("ee", embedding);

  await EmbeddingModel.findOneAndUpdate(
    { entityType, sourceId },
    { embedding, text },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

module.exports = { saveOrUpdateEmbedding };
