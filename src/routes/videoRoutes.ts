import { Router } from "express";
import { getAllVideos } from "../controllers/videoController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/",authenticateToken, getAllVideos)

export default router;