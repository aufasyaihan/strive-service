import { Router } from "express";
import { getAllVideos } from "../controllers/videoController";

const router = Router();

router.get("/", getAllVideos)

export default router;