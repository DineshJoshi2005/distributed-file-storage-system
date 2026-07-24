import express from 'express';
import cookieParser from "cookie-parser";
import { logger } from './middleware/logger.middleware.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js'
import fileRoutes from "./routes/file.routes.js";


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/files", fileRoutes);

export default app;