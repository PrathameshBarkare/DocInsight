import axios from "axios";
import Document from "../models/Document.js";
import Chunk from "../models/chunks.js";
import { createChunks } from "../services/chunkService.js";

const uploadPDF = async (req, res) => {
  try{
    if(!req.file){
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const newDocument = await Document.create({
      originalFileName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path.replace(/\\/g, "/"),
      fileSize: req.file.size,
    });

    res.status(201).json({
      message: "Processing document",
      document: newDocument
    });

    try{
      const doclingResponse = await axios.post(
        "http://127.0.0.1:8000/parse",
        {
          file_path: newDocument.filePath,
        }
      );
      newDocument.content = doclingResponse.data.markdown;

      try{
        const chunks = await createChunks(newDocument.content);

        const embeddingResponse = await axios.post(
          "http://127.0.0.1:8000/embeddings",
          {
            texts: chunks,
          }
        );

        const embeddings = embeddingResponse.data.embeddings;

        const chunkDocuments = chunks.map((chunk, index) => ({
          documentId: newDocument._id,
          chunkIndex: index,
          content: chunk,
          embedding: embeddings[index],
        }));

        await Chunk.insertMany(chunkDocuments);

        newDocument.status = "ready";
        await newDocument.save();
      }
      catch(chunkError){
        console.error("Chunk Error:", chunkError);

        newDocument.status = "failed";
        await newDocument.save();
      }
    }
    catch(doclingError){
      console.error("Docling Error:", doclingError);
      newDocument.status = "failed";
      await newDocument.save();
    }
  }
  catch(error){
    console.error("Error uploading document:", error);
    res.status(500).json({
      message: error.message,
    });
  }
}

export {uploadPDF}
