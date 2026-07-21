import Document from "../models/Document.js";

const getUploadedDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .select("originalFileName fileName fileSize status createdAt")
      .sort({ createdAt: 1 });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { getUploadedDocuments };