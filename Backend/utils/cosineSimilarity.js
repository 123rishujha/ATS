function cosineSimilarity(vec1, vec2) {
    const dot = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return dot / (mag1 * mag2);
  }
  
  module.exports = { cosineSimilarity };
  