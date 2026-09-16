import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {getChatHistory} from "../controllers/getChatHistoryController.js";

const router = express.Router();
router.get("/:documentId", authMiddleware, getChatHistory);

export default router;