import express from "express";
import cors from "cors";
import articleRoutes from "./routes/articleRoutes";
import videoRoutes from "./routes/videoRoutes";
import { errorHandler, type AppError } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://strive-aufa.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to the Strive Service API");
});
app.use("/auth", authRoutes);
app.use("/article", articleRoutes);
app.use("/video", videoRoutes);

app.use((req, res, next) => {
    const err: AppError = new Error(`Not Found - ${req.originalUrl}`);
    err.status = 404;
    next(err);
});

app.use(errorHandler);

export default app;
