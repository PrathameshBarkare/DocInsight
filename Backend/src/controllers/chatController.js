import axios from "axios";
import Chunks from "../models/chunks.js";
import cosineSimilarity from "../services/cosineSimilarityService.js";
import { buildPrompt } from "../services/promptService.js";
import { generateAnswer } from "../services/llmService.js";

const chat = async (req, res) => {
  try {
    const { documentId, question } = req.body;

    const embeddingResponse = await axios.post(
      "http://127.0.0.1:8000/embeddings",
      {
        texts: [question],
      },
    );

    const questionEmbedding = embeddingResponse.data.embeddings[0];

    const chunks = await Chunks.find({ documentId }).select(
      "content embedding",
    );

    if (chunks.length === 0) {
      return res.status(404).json({
        message: "No chunks found for this document.",
      });
    }

    const scoredChunks = chunks.map((chunk) => ({
      ...chunk.toObject(),
      score: cosineSimilarity(questionEmbedding, chunk.embedding),
    }));

    scoredChunks.sort((a, b) => b.score - a.score);

    const topChunks = scoredChunks.slice(0, 5).map(({ content, score }) => ({
      content,
      score,
    }));

    const prompt = buildPrompt(question, topChunks);
    const answer = await generateAnswer(prompt);

    res.status(200).json({
      answer,
      chunks: topChunks,
    });

  } catch (error) {
    console.error("Error in chat controller:", error);

    res.status(500).json({ error: error.message,
    details: error.response?.data || null, });
  }
};

export { chat };
