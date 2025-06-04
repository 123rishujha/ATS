// models/EmbeddingModel.js
const mongoose = require("mongoose");

const embeddingSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ["candidateProfile", "jobPost", "application"],
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

embeddingSchema.index({ entityType: 1, sourceId: 1 }, { unique: true });

const EmbeddingModel = mongoose.model("Embedding", embeddingSchema);

module.exports = { EmbeddingModel };
