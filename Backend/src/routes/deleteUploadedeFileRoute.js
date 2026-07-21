import express from "express";
import { deleteDocument } from "../controllers/deletedocumentController.js";

const router = express.Router();

router.delete("/delete/:id", deleteDocument);

export default router;