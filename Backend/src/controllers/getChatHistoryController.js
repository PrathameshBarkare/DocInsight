import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

const getChatHistory = async (req, res) => {
  try {
    const { documentId } = req.params;

    const conversation = await Conversation.findOne({
      userId: req.user.id,
      documentId,
    });

    if (!conversation) {
      return res.status(200).json({
        messages: [],
      });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      conversationId: conversation._id,
      messages,
    });
  } catch (error) {
    console.error("Chat history error:", error);

    res.status(500).json({
      message: "Failed to load chat history",
    });
  }
};

export { getChatHistory };