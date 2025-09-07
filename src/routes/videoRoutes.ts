import { Router } from "express";
import { getAllVideos, getVideoById } from "../controllers/videoController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken, getAllVideos);
router.get("/:id", authenticateToken, getVideoById);

export default router;
