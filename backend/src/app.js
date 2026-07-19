import express from 'express';
import cookieParser from "cookie-parser";
import { logger } from './middleware/logger.middleware.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js'


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);

export default app;