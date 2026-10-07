import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { uploadPDF } from "../controllers/uploadDocumentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadPDF
);

export default router;