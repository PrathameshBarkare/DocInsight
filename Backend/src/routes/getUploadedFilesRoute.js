import express from "express";
import {getUploadedDocuments} from "../controllers/getUploadedDocumentsController.js";

const router = express.Router();
router.get("/files", getUploadedDocuments);

export default router;