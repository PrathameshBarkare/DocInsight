import axios from "axios";
import Document from "../models/Document.js";

const uploadPDF = async (req, res) => {
  try{
    if(!req.file){
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const newDocument = await Document.create({
      fileName: req.file.filename,
      filePath: req.file.path.replace(/\\/g, "/"),
      fileSize: req.file.size,
    });

    try{
      const doclingResponse = await axios.post(
        "http://127.0.0.1:8000/parse",
        {
          file_path: newDocument.filePath,
        }
      );
      newDocument.content = doclingResponse.data.markdown;
      newDocument.status = "ready";
      
      await newDocument.save();
    }
    catch(doclingError){
      console.error("Docling Error:", doclingError);
      newDocument.status = "failed";
      await newDocument.save();
    }

    res.status(201).json({
      message: "Document uploaded successfully",
      document: newDocument 
    });
  }
  catch(error){
    console.error("Error uploading document:", error);
    res.status(500).json({
      message: error.message,
    });
  }
}

export {uploadPDF}
