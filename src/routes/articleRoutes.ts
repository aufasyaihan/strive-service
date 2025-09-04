import { Router } from "express";
import { getAllArticles } from "../controllers/articleController";

const router = Router();

router.get("/", getAllArticles)

export default router;