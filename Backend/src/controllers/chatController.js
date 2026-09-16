import axios from "axios";
import Chunks from "../models/chunks.js";
import Document from "../models/Document.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import cosineSimilarity from "../services/cosineSimilarityService.js";
import { buildPrompt } from "../services/promptService.js";
import { generateAnswer } from "../services/llmService.js";

const chat = async (req, res) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({
        message: "Document ID and question are required.",
      });
    }

    // 1. Verify that the document belongs to the logged-in user
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found.",
      });
    }

    // 2. Find existing conversation for this user + document
    let conversation = await Conversation.findOne({
      userId: req.user.id,
      documentId,
    });

    // 3. Create conversation if it doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        userId: req.user.id,
        documentId,
        title: question,
      });
    }

    // 4. Save user's question
    await Message.create({
      conversationId: conversation._id,
      role: "user",
      content: question,
    });

    // 5. Create embedding for question
    const embeddingResponse = await axios.post(
      "http://127.0.0.1:8000/embeddings",
      {
        texts: [question],
      },
    );

    const questionEmbedding = embeddingResponse.data.embeddings[0];

    // 6. Get chunks belonging to this document
    const chunks = await Chunks.find({ documentId }).select(
      "content embedding",
    );

    if (chunks.length === 0) {
      return res.status(404).json({
        message: "No chunks found for this document.",
      });
    }

    // 7. Calculate similarity scores
    const scoredChunks = chunks.map((chunk) => ({
      ...chunk.toObject(),
      score: cosineSimilarity(questionEmbedding, chunk.embedding),
    }));

    // 8. Sort by similarity
    scoredChunks.sort((a, b) => b.score - a.score);

    // 9. Select top 5 chunks
    const topChunks = scoredChunks.slice(0, 5).map(({ content, score }) => ({
      content,
      score,
    }));

    // 10. Build RAG prompt
    const prompt = buildPrompt(question, topChunks);

    // 11. Generate answer
    const answer = await generateAnswer(prompt);

    // 12. Save assistant's answer
    await Message.create({
      conversationId: conversation._id,
      role: "assistant",
      content: answer,
    });

    // 13. Send response
    res.status(200).json({
      answer,
      chunks: topChunks,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Error in chat controller:", error);

    res.status(500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
};

export { chat };