import express from "express";
import articleRoutes from "./routes/articleRoutes";
import videoRoutes from "./routes/videoRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

// Routes
app.use("/article", articleRoutes);
app.use("/video", videoRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
