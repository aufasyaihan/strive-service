import { Router } from "express";
import { getAllVideos, getVideoById } from "../controllers/videoController";
import { authenticateToken } from "../middleware/auth";
import { checkVideoAccess } from "../middleware/content";

const router = Router();

router.get("/", authenticateToken, getAllVideos);
router.get("/:id", authenticateToken, checkVideoAccess, getVideoById);

export default router;
