import express from "express";
import { chat } from "../controllers/chatController.js";
import authController from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chat", authController, chat);

export default router;