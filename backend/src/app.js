import express from 'express';
import { logger } from './middleware/logger.middleware.js';
import healthRoutes from './routes/health.routes.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/health", healthRoutes);

export default app;