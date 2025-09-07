import { Router } from "express";
import {
    getAllArticles,
    getArticleById,
} from "../controllers/articleController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken, getAllArticles);
router.get("/:id", authenticateToken, getArticleById);

export default router;
