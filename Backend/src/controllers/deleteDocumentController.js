import fs from "fs/promises";
import Document from "../models/Document.js";
import Chunk from "../models/chunks.js";

const deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.id;

    // Find the document
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // Delete uploaded PDF from uploads folder
    try {
      await fs.unlink(document.filePath);
    } catch (fileError) {
      console.warn("File not found or already deleted:", fileError.message);
    }

    // Delete all chunks related to this document
    await Chunk.deleteMany({
      documentId: documentId,
    });

    // Delete document from MongoDB
    await Document.deleteOne({
      _id: documentId,
      userId: req.user.id,
    });

    res.status(200).json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export { deleteDocument };
