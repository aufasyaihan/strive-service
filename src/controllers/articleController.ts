import type { Request, Response } from 'express';
import prisma from "../config/db.config";

export async function getAllArticles(req: Request, res: Response) {
    try {
        const articles = await prisma.article.findMany({
            include: { author: true },
        });
        res.json({
            meta: {
                message: "success",
                code: 200,
            },
            articles,
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).json({
            meta: {
                message: "error",
                code: 500,
            },
        });
    }
}
