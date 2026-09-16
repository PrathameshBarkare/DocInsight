import express from 'express';
import cors from 'cors';

import uploadRoutes from './routes/uploadRoutes.js';
import getUploadedFiles from './routes/getUploadedFilesRoute.js';
import deleteUploadedFile from './routes/deleteUploadedeFileRoute.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRouts.js';
import getChatHistory from './routes/getChatHistoryRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api", getUploadedFiles);
app.use("/api", deleteUploadedFile);
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat-history", getChatHistory);

export default app;