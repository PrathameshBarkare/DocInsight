import express from "express";
import { deleteDocument } from "../controllers/deleteDocumentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.delete("/delete/:id", authMiddleware, deleteDocument);

export default router;
