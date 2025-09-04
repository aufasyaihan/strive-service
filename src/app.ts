import express from "express";
import articleRoutes from "./routes/articleRoutes";
import videoRoutes from "./routes/videoRoutes";
import { errorHandler, type AppError } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

// Routes
app.use("/article", articleRoutes);
app.use("/video", videoRoutes);

// 404 handler for unmatched routes -> return JSON instead of HTML
app.use((req, res, next) => {
	const err: AppError = new Error(`Not Found - ${req.originalUrl}`);
	err.status = 404;
	next(err);
});

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
