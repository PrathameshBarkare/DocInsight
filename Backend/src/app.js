import express from 'express';
import cors from 'cors';

import uploadRoutes from './routes/uploadRoutes.js';
import getUploadedFiles from './routes/getUploadedFilesRoute.js';
import deleteUploadedFile from './routes/deleteUploadedeFileRoute.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api", getUploadedFiles);
app.use("/api", deleteUploadedFile);
app.use("/api", chatRoutes);

export default app;