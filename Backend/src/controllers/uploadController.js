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
