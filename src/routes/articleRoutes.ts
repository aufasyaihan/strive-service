import { Router } from "express";
import { getAllArticles } from "../controllers/articleController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/",authenticateToken, getAllArticles)

export default router;