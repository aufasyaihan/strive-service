import { Router } from "express";
import {
    getAllArticles,
    getArticleById,
} from "../controllers/articleController";
import { authenticateToken } from "../middleware/auth";
import { checkArticleAccess } from "../middleware/content";

const router = Router();

router.get("/", authenticateToken, getAllArticles);
router.get("/:id", authenticateToken, checkArticleAccess, getArticleById);

export default router;
